import ShortUniqueId from "short-unique-id";
import User from "../../models/user.js";
import Package from "../../models/package.js";
import ExpressError from "../../utilities/express-error.js";
import Ticket from "../../models/ticket.js";
import Coupon from "../../models/coupon.js";
import constants from "../../constants.js";
import { calculateDiscountPrice } from "../../utilities/utils.js";
import Activity from "../../models/activity.js";

export const bookTicket = async (req, res) => {
  let {
    details,
    total_amount,
    phone_no,
    payment_mode,
    coupon,
    dob,
    state,
    city,
    locality,
  } = req.body;
  let totalAmount = 0;
  let user = await User.findOne({ phone_no, dob: new Date(dob) });

  if (!user) {
    user = new User({ phone_no, dob: new Date(dob), state, city, locality });
  }

  let total_coins = 0;

  const newDetails = await Promise.all(
    details.map(async (person) => {
      if (person.package) {
        const pack = await Package.findById(person.package);
        totalAmount += pack.price;
        total_coins += pack.coins;
      }
      if (!person.age) delete person.age;
      if (!person.name) delete person.name;
      if (!person.gender) delete person.gender;
      return person;
    })
  );

  user.funingo_money += total_coins;

  let isPremium = false;
  for (let data of user.premium || []) {
    if (new Date(data.expires_on) > Date.now()) {
      isPremium = true;
      break;
    }
  }
  if (isPremium) {
    totalAmount /= 2;
  }

  if (coupon) {
    const discount = await calculateDiscountPrice({
      code: coupon,
      total_amount: totalAmount,
      updateCouponCount: true,
    });
    totalAmount -= discount.discount;
  }
  console.log("discount", { totalAmount });

  if (totalAmount !== total_amount) {
    throw new ExpressError("Total amount doesn't match", 400);
  }

  const new_short_id = new ShortUniqueId({
    dictionary: "number",
    // length: 3
  });

  const newTicket = new Ticket({
    fun_date: new Date(),
    total_amount,
    expired: false,
    payment_verified: true,
    details: newDetails,
    short_id: new_short_id(),
    user,
    payment_mode,
    phone_no: phone_no ?? "",
  });

  user.booked_tickets.push(newTicket);

  await newTicket.save();
  await user.save();

  res.status(200).send({
    short_id: newTicket.short_id,
    success: true,
  });
};

export const checkActivityBooking = async (req, res) => {
  const { activity_name } = req.params;
  const activity = await Activity.findOne({ name: activity_name });

  if (!activity) {
    const activity = new Activity({ name: activity_name, bookings: 0 });
    await activity.save();
  }

  res.status(200).send({ success: true, bookings: activity?.bookings || 0 });
};
