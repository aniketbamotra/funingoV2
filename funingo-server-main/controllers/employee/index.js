import ShortUniqueId from 'short-unique-id';
import User from '../../models/user.js';
import Package from '../../models/package.js';
import ExpressError from '../../utilities/express-error.js';
import Ticket from '../../models/ticket.js';
import Coupon from '../../models/coupon.js';
import constants from '../../constants.js';

export const bookTicket = async (req, res) => {
  let { details, total_amount, phone_no, payment_mode } = req.body;
  let totalAmount = 0;
  const user = await User.findOne({ phone_no });
  console.log("user",user);
  console.log("details",details);
  const newDetails = await Promise.all(
    details.map(async person => {
      const existing = person?.freebie;
      const freebies = user?.existing_flags?.find(
        exist => exist.id === existing
      );
      if (person.package) {
        const pack = await Package.findById(person.package);
        totalAmount += pack.price;
        totalAmount +=
          constants.red_flag_price *
          Math.max(person.extra_red - (freebies?.red ?? 0), 0);
        totalAmount +=
          constants.yellow_flag_price *
          Math.max(person.extra_yellow - (freebies?.yellow ?? 0), 0);
        totalAmount +=
          constants.green_flag_price *
          Math.max(person.extra_green - (freebies?.green ?? 0), 0);
      }
      totalAmount += constants.golden_flag_price * person.golden_flag;

      person.extra_red += freebies?.red ?? 0;
      person.extra_green += freebies?.green ?? 0;
      person.extra_yellow += freebies?.yellow ?? 0;
      return person;
    })
  );

  totalAmount += 0.18 * totalAmount;
  totalAmount-=details[0].discount;
  totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;


  // totalAmount=total_amount;
  console.log("totalAmount",totalAmount);
  console.log("total_amount",total_amount);

  if (totalAmount !== total_amount) {
    throw new ExpressError("Total amount doesn't match index.js", 400);
  }
 
  const new_short_id = new ShortUniqueId({
    dictionary: 'number',
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
    phone_no: phone_no ?? ''
  });

  console.log("newTicket",newTicket);

  await newTicket.save();

  if(details[0].discount>0)
    {
      const coupon2 = await Coupon.findOne({code:details[0].promo_code});

  if (!coupon2) {
    return res.status(404).json({ success: false, error: 'Coupon not found ticket.js' });
  }
  if (coupon2.count > 0) {
    coupon2.count -= 1;
    if(coupon2.count==0)
    await Coupon.findOneAndDelete({ code:text });
  } 

  // Save the changes to the database

  if(coupon2.count>0)
  await coupon2.save();
    }

  res.status(200).send({
    short_id: newTicket.short_id,
    success: true
  });
};
