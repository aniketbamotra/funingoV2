// import QRTicket from '../models/qr-ticket.js';
// import Ticket from '../models/ticket.js';
// import ExpressError from '../utilities/express-error.js';
// import constants from '../constants.js';
// import Package from '../models/package.js';
// import {
//   calculateDiscountPrice,
//   calculateFuningoMoneyToAdd,
//   sendMessageToPhone
// } from '../utilities/utils.js';
// import { razorpay } from '../index.js';
// import ShortUniqueId from 'short-unique-id';
// import {
//   validatePaymentVerification,
//   validateWebhookSignature
// } from 'razorpay/dist/utils/razorpay-utils.js';
// import User from '../models/user.js';

// export const getAllTickets = async (req, res) => {
//   const { user } = req;
//   const tickets =
//     (await Ticket.find({ user })
//       .populate('details.package')
//       .sort({ fun_date: -1 })) || [];

//   res.status(200).send({
//     success: true,
//     tickets
//   });
// };

// export const getQRTickets = async (req, res) => {
//   const { query } = req.query;
//   const ticket = await Ticket.findOne({
//     $and: [
//       { $or: [{ short_id: query }, { phone_no: query }] },
//       query.length >= 10 ? { payment_verified: true } : {},
//       query.length >= 10
//         ? {
//             fun_date: {
//               $gte: new Date(new Date().setHours(0, 0, 0, 0)),
//               $lt: new Date(new Date().setHours(23, 59, 59, 0))
//             }
//           }
//         : {}
//     ]
//   }).populate(['details.package', 'details.qr_ticket']);

//   if (!ticket) {
//     throw new ExpressError('Ticket not found', 404);
//   }

//   const d1 = new Date(new Date(ticket.fun_date).setHours(0, 0, 0, 0));
//   const d2 = new Date(new Date().setHours(0, 0, 0, 0));

//   if (d1 < d2) {
//     throw new ExpressError('Ticket is expired', 400);
//   }

//   const resp = await Promise.all(
//     ticket.details.map(async tic => {
//       const new_short_id = new ShortUniqueId({
//         dictionary: 'number'
//       });
//       if (tic.qr_ticket) {
//         return {
//           ticketDetails: tic.qr_ticket.toJSON(),
//           qr: `http://api.qrserver.com/v1/create-qr-code/?data=${constants.website_url}/e/redeem?tid=${tic.qr_ticket.short_id}`
//         };
//       }
//       const qrTicket = new QRTicket({
//         person_name: tic.person_name,
//         red: (tic.package?.red || 0) + tic.extra_red,
//         green: (tic.package?.green || 0) + tic.extra_green,
//         yellow: (tic.package?.yellow || 0) + tic.extra_yellow,
//         golden: tic.golden_flag,
//         short_id: new_short_id(),
//         parent_ticket: ticket._id,
//         premium_discount: tic?.premium_discount,
//         date: ticket.fun_date
//       });
//       tic.qr_ticket = qrTicket;
//       await qrTicket.save();
//       return {
//         ticketDetails: qrTicket.toJSON(),
//         qr: `http://api.qrserver.com/v1/create-qr-code/?data=${constants.website_url}/e/redeem?tid=${qrTicket.short_id}`
//       };
//     })
//   );
//   ticket.save();

//   res.status(200).send({
//     success: true,
//     data: resp,
//     date: new Date(ticket.toJSON().fun_date),
//     payment_verified: ticket.payment_verified
//   });
// };

// export const getDiscount = async (req, res) => {
//   const { code, total_amount } = req.body;
//   const discount = await calculateDiscountPrice({ code, total_amount });
//   res.status(200).send({
//     success: true,
//     ...discount
//   });
// };

// export const createTicketOrder = async (req, res) => {
//   const {
//     preferred_slot,
//     total_amount,
//     details,
//     fun_date,
//     short_id,
//     phone_no,
//     used_funingo_money = 0,
//     coupon
//   } = req.body;

//   const { user } = req;
//   let totalAmount = 0;
//   let is_premium = false;
//   let premium_types = [];
//   const newDetails = await Promise.all(
//     details.map(async person => {
//       if (person.premium_discount === '100%') {
//         is_premium = true;
//         premium_types = [
//           ...new Set([
//             ...premium_types,
//             person.premium_discount + '-' + person.premium_duration
//           ])
//         ];
//         return person;
//       }
//       const existing = person?.freebie;
//       const freebies = user.existing_flags?.find(
//         exist => exist.id === existing
//       );
//       user.existing_flags = user.existing_flags.filter(
//         exist => exist.id !== existing
//       );
//       let amount = 0;
//       if (person?.package) {
//         const pack = await Package.findById(person?.package);
//         amount += pack.price;
//         amount +=
//           constants.red_flag_price *
//           Math.max(person.extra_red - (freebies?.red ?? 0), 0);
//         amount +=
//           constants.yellow_flag_price *
//           Math.max(person.extra_yellow - (freebies?.yellow ?? 0), 0);
//         amount +=
//           constants.green_flag_price *
//           Math.max(person.extra_green - (freebies?.green ?? 0), 0);
//       }
//       amount += constants.golden_flag_price * person.golden_flag;

//       person.amount = amount;

//       person.extra_red += freebies?.red ?? 0;
//       person.extra_green += freebies?.green ?? 0;
//       person.extra_yellow += freebies?.yellow ?? 0;

//       if (person.premium_discount === '50%') {
//         totalAmount += Math.floor(parseInt(amount || 0) / 2);
//       } else {
//         totalAmount += amount;
//       }
//       if (['50%', '100%'].includes(person.premium_discount)) {
//         is_premium = true;

//         premium_types = [
//           ...new Set([
//             ...premium_types,
//             person.premium_discount + '-' + person.premium_duration
//           ])
//         ];
//       }

//       return person;
//     })
//   );

//   if (
//     used_funingo_money !== 0 &&
//     used_funingo_money !==
//       Math.floor(user.funingo_money * (constants.percent_of_fm_to_use / 100))
//   ) {
//     throw new ExpressError("used_funingo_money doesn't match", 400);
//   }

//   if (coupon) {
//     const discount = await calculateDiscountPrice({
//       code: coupon,
//       total_amount: totalAmount
//     });
//     totalAmount -= discount.discount;
//   }

//   totalAmount -= used_funingo_money;

//   totalAmount += Math.ceil(0.18 * totalAmount);
//   totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

//   if (totalAmount !== total_amount) {
//     throw new ExpressError("Total amount doesn't match", 400);
//   }

//   const newTicket = new Ticket({
//     fun_date: new Date(fun_date),
//     preferred_slot,
//     total_amount,
//     expired: false,
//     payment_verified: false,
//     details: newDetails,
//     user,
//     short_id,
//     phone_no,
//     used_funingo_money,
//     coupon_used: coupon,
//     is_premium,
//     premium_types
//   });

//   await newTicket.save();
//   await user.save();

//   if (total_amount === 0) {
//     // Runing the tasks of Verify Payment!
//     newTicket.payment_verified = true;
//     user.funingo_money -= newTicket.used_funingo_money;

//     await sendMessageToPhone({
//       phone_no: user.phone_no,
//       message: `Your ticket id is ${newTicket.short_id}. Please collect your passes from the counter.`
//     });

//     await newTicket.save();
//     await user.save();
//     res.status(200).send({ success: true, ticket: newTicket.toJSON() });
//     return;
//   }

//   const options = {
//     amount: total_amount * 100,
//     currency: 'INR',
//     receipt: short_id,
//     notes: {
//       ticket_id: newTicket._id.toString(),
//       user_id: user._id
//     }
//   };
//   const response = await razorpay.orders.create(options);
//   res.status(200).send(response);
// };

// export const verifyTicketPayment = async (req, res) => {
//   const { short_id, order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;
//   const { user } = req;
//   const resp = validatePaymentVerification(
//     {
//       order_id,
//       payment_id: razorpay_payment_id
//     },
//     razorpay_signature,
//     process.env.RAZORPAY_API_KEY_SECRET
//   );

//   if (!resp) {
//     throw new ExpressError("Couldn't verify your payment", 400);
//   }
//   const ticket = await Ticket.findOne({ short_id }).populate('details.package');

//   user.booked_tickets.push(ticket);

//   let totalAmount = ticket.details.reduce(
//     (totalAmount, person) => totalAmount + person.amount,
//     0
//   );

//   user.funingo_money -= ticket.used_funingo_money;

//   const funingoMoneyToAdd = calculateFuningoMoneyToAdd(totalAmount);

//   user.funingo_money = user.funingo_money + funingoMoneyToAdd;
//   await user.save();

//   ticket.added_funingo_money = funingoMoneyToAdd;
//   ticket.payment_verified = true;
//   await ticket.save();

//   await sendMessageToPhone({
//     phone_no: user.phone_no,
//     message: `Your ticket id is ${ticket.short_id}. Please collect your passes from the counter.`
//   });

//   res.status(200).send({
//     ticket,
//     success: true
//   });
// };

// export const webhookPaymentVerification = async (req, res) => {
//   const resp = validateWebhookSignature(
//     JSON.stringify(req.body),
//     req.headers['x-razorpay-signature'],
//     'secret'
//   );
//   console.log(req.body.payload);

//   if (resp) {
//     const short_id = req.body.payload.order.entity.receipt;
//     const ticket = await Ticket.findOne({ short_id }).populate('user');
//     if (!ticket.payment_verified) {
//       ticket.payment_verified = true;
//       await ticket.save();
//       ticket.user.booked_tickets = [...ticket.user.booked_tickets, ticket];
//       await ticket.user.save();
//       await sendMessageToPhone({
//         phone_no: ticket.user.phone_no,
//         message: `Your ticket id is ${ticket.short_id}. Please collect your passes from the counter.`
//       });
//     }
//   }

//   res.status(200).send({
//     success: true
//   });
// };

// export const saveTicketRiskImage = async (req, res) => {
//   const image = {
//     url: req?.file?.path,
//     filename: req?.file?.filename
//   };
//   const { short_id } = req.body;
//   const ticket = await Ticket.findOne({ short_id });

//   if (!ticket) throw new ExpressError('Ticket not found!', 404);

//   ticket.riskConsentImage = image;
//   await ticket.save();

//   res.status(200).send({ success: true });
// };

// export const deleteTicket = async (req, res) => {
//   const { short_id } = req.params;
//   const { user } = req;

//   const ticket = await Ticket.find({ short_id, user: user._id });
//   if (!ticket) throw new ExpressError('Ticket not found with the user!!', 404);

//   await Ticket.findByIdAndDelete(ticket._id);

//   res.status(200).send({ success: true });
// };

// import React,{ useState } from 'react';
import QRTicket from "../models/qr-ticket.js";
import Coupon from "../models/coupon.js";
import Ticket from "../models/ticket.js";
import ExpressError from "../utilities/express-error.js";
import constants from "../constants.js";
import Package from "../models/package.js";

import {
  calculateDiscountPrice,
  calculateFuningoMoneyToAdd,
  sendMessageToPhone,
} from "../utilities/utils.js";
import { razorpay } from "../index.js";
import ShortUniqueId from "short-unique-id";
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from "razorpay/dist/utils/razorpay-utils.js";
import User from "../models/user.js";
import Activity from "../models/activity.js";

export const getAllTickets = async (req, res) => {
  const { phone_no } = req.query;
  const tickets =
    (await Ticket.find({ phone_no, payment_verified: true })
      .populate("details.package")
      .sort({ fun_date: -1 })) || [];

  res.status(200).send({
    success: true,
    tickets,
  });
};

export const getQRTickets = async (req, res) => {
  const { phone_no, number_of_tickets, ticket_id } = req.query;
  let ticket_count = parseInt(number_of_tickets);
  let user;
  if (ticket_id) {
    const ticket = await Ticket.findOne({ short_id: ticket_id }).populate(
      "user"
    );
    if (!ticket) throw new ExpressError("Ticket not found", 400);
    ticket_count = ticket.details.length;
    user = ticket.user;
  } else {
    user = await User.findOne({ phone_no }).populate("booked_tickets");
  }

  if (!user) {
    throw new ExpressError("User not found", 404);
  }

  if (Math.floor(user.funingo_money / 2000) < ticket_count) {
    throw new ExpressError(
      "Minimum required coins need to be 2000 per user",
      400
    );
  }

  const qr = `http://api.qrserver.com/v1/create-qr-code/?data=${
    constants.website_url
  }/e/redeem?tid=${user.phone_no.split("-")[1]}`;

  const finalData = [...Array(ticket_count)].map(() => ({
    qr,
    phone_no,
  }));

  res.status(200).send({
    success: true,
    tickets: finalData,
    total_coins: user.funingo_money,
  });
};

export const getDiscount = async (req, res) => {
  var { code, total_amount } = req.body;

  const discount = await calculateDiscountPrice({ code, total_amount });
  res.status(200).send({
    success: true,
    ...discount,
  });
};

export const createTicketOrder = async (req, res) => {
  var {
    preferred_slot,
    total_amount,
    details,
    fun_date,
    short_id,
    phone_no,
    email,
    coupon,
  } = req.body;

  const { user } = req;
  let totalAmount = 0;
  const newDetails = await Promise.all(
    details.map(async (person) => {
      if (person?.package) {
        const pack = await Package.findById(person.package);
        totalAmount += pack.price;
      } else {
        throw new ExpressError("Person without package is not allowed");
      }
      return person;
    })
  );

  let isPremium = false;
  for (let data of user.premium || []) {
    if (new Date(data.expires_on) > Date.now()) {
      isPremium = true;
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

  if (totalAmount !== total_amount) {
    throw new ExpressError("Total amount doesn't match ticket.js", 400);
  }

  const newTicket = new Ticket({
    fun_date: new Date(fun_date),
    preferred_slot,
    total_amount,
    payment_verified: false,
    details: newDetails,
    user,
    short_id,
    phone_no,
    email,
    coupon_used: coupon,
  });

  user.booked_tickets.push(newTicket);

  await newTicket.save();
  await user.save();

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: short_id,
    notes: {
      ticket_id: newTicket._id.toString(),
      user_id: user._id,
    },
  };
  const response = await razorpay.orders.create(options);
  res.status(200).send(response);
};

export const verifyTicketPayment = async (req, res) => {
  const { short_id, order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const { user } = req;

  const resp = validatePaymentVerification(
    {
      order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    process.env.RAZORPAY_API_KEY_SECRET
  );

  if (!resp) {
    throw new ExpressError("Couldn't verify your payment", 400);
  }
  const ticket = await Ticket.findOne({ short_id }).populate([
    "details.package",
    "user",
  ]);
  ticket.payment_verified = true;
  await ticket.save();

  // Adding coins (funingo_money) in user profile
  const totalCoins = ticket.details.reduce(
    (total, curr_person) => total + curr_person.package.coins,
    0
  );
  ticket.user.funingo_money += totalCoins;

  await ticket.user.save();

  await sendMessageToPhone({
    phone_no: user.phone_no,
    message: `Your ticket id is ${ticket.short_id}. Please collect your passes from the counter.`,
  });

  res.status(200).send({
    ticket,
    success: true,
  });
};

export const webhookPaymentVerification = async (req, res) => {
  const resp = validateWebhookSignature(
    JSON.stringify(req.body),
    req.headers["x-razorpay-signature"],
    "secret"
  );

  if (resp) {
    const short_id = req.body.payload.order.entity.receipt;
    const ticket = await Ticket.findOne({ short_id }).populate("user");
    if (!ticket.payment_verified) {
      ticket.payment_verified = true;
      await ticket.save();
      await sendMessageToPhone({
        phone_no: ticket.user.phone_no,
        message: `Your ticket id is ${ticket.short_id}. Please collect your passes from the counter.`,
      });
    }
  }

  res.status(200).send({
    success: true,
  });
};

export const saveTicketRiskImage = async (req, res) => {
  const image = {
    url: req?.file?.path,
    filename: req?.file?.filename,
  };
  const { short_id } = req.body;
  const ticket = await Ticket.findOne({ short_id });

  if (!ticket) throw new ExpressError("Ticket not found!", 404);

  ticket.riskConsentImage = image;
  await ticket.save();

  res.status(200).send({ success: true });
};

export const deleteTicket = async (req, res) => {
  const { short_id } = req.params;
  const { user } = req;

  const ticket = await Ticket.find({ short_id, user: user._id });
  if (!ticket) throw new ExpressError("Ticket not found with the user!!", 404);

  await Ticket.findByIdAndDelete(ticket._id);

  res.status(200).send({ success: true });
};

export const redeemFuningoCoins = async (req, res) => {
  const { phone_no, coins, activity_name } = req.body;

  const user = await User.findOne({ phone_no });
  user.funingo_money -= coins;
  await user.save();

  let activity = await Activity.findOne({ name: activity_name });
  if (!activity) {
    activity = new Activity({ name: activity_name, bookings: 0 });
  }
  activity.bookings += 1;
  await activity.save();

  res.status(200).json({
    success: true,
    funingo_money: user.funingo_money,
    bookings: activity.bookings,
  });
};
