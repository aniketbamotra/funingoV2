// import mongoose from 'mongoose';

// const ticketSchema = new mongoose.Schema(
//   {
//     fun_date: {
//       type: Date,
//       required: true
//     },
//     short_id: {
//       type: String,
//       unique: true
//     },
//     preferred_slot: String,
//     details: [
//       {
//         person_name: String,
//         age: Number,
//         gender: {
//           type: String,
//           enum: ['male', 'female', 'others']
//         },
//         package: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Package'
//         },
//         extra_red: {
//           type: Number,
//           default: 0
//         },
//         extra_green: {
//           type: Number,
//           default: 0
//         },
//         extra_yellow: {
//           type: Number,
//           default: 0
//         },
//         golden_flag: {
//           type: Number,
//           default: 0
//         },
//         amount: Number,
//         qr_ticket: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'QRTicket'
//         },
//         premium_discount: {
//           // 50% | 100% | null
//           type: String
//         }
//       }
//     ],
//     is_premium: {
//       type: Boolean,
//       default: false
//     },
//     premium_types: [
//       {
//         type: String // 50%-6_months | 50%-1_year | 50%-100_years | 100%-6_months | 100%-1_year | 100%-100_years
//       }
//     ],
//     added_funingo_money: {
//       type: Number,
//       default: 0
//     },
//     total_amount: Number,
//     used_funingo_money: {
//       type: Number,
//       default: 0
//     },
//     coupon_used: {
//       type: String,
//       required: false
//     },
//     expired: {
//       type: Boolean,
//       default: false
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     phone_no: {
//       type: String,
//       required: false
//     },
//     payment_verified: {
//       type: Boolean,
//       default: false
//     },
//     payment_mode: {
//       type: String,
//       enum: ['razorpay', 'online', 'cash'],
//       default: 'razorpay'
//     },
//     freebies_added: {
//       red: Number,
//       green: Number,
//       yellow: Number,
//       golden: Number
//     },
//     riskConsentImage: {
//       url: String,
//       filename: String
//     }
//   },
//   {
//     versionKey: false
//   }
// );

// const Ticket = mongoose.model('Ticket', ticketSchema);
// export default Ticket;










import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    fun_date: {
      type: Date,
      required: true
    },
    short_id: {
      type: String,
      unique: true
    },
    preferred_slot: String,
    details: [
      {
        person_name: String,
        age: Number,
        gender: {
          type: String,
          enum: ['male', 'female', 'others']
        },
        package: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Package'
        },
        extra_red: {
          type: Number,
          default: 0
        },
        extra_green: {
          type: Number,
          default: 0
        },
        extra_yellow: {
          type: Number,
          default: 0
        },
        golden_flags: {
          type: Number,
          default: 0
        },
        funingo_coins:{
          type: Number,
          default: 0
        },
        amount: Number,
        qr_ticket: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'QRTicket'
        },
        premium_discount: {
          // 50% | 100% | null
          type: String
        }
      }
    ],
    is_premium: {
      type: Boolean,
      default: false
    },
    premium_types: [
      {
        type: String // 50%-6_months | 50%-1_year | 50%-100_years | 100%-6_months | 100%-1_year | 100%-100_years
      }
    ],
    added_funingo_money: {
      type: Number,
      default: 0
    },
    total_amount: Number,
    used_funingo_money: {
      type: Number,
      default: 0
    },
    coupon_used: {
      type: String,
      required: false
    },
    expired: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    phone_no: {
      type: String,
      required: false
    },
    payment_verified: {
      type: Boolean,
      default: false
    },
    payment_mode: {
      type: String,
      enum: ['razorpay', 'online', 'cash','card'],
      default: 'razorpay'
    },
    freebies_added: {
      red: Number,
      green: Number,
      yellow: Number,
      golden: Number
    },
    riskConsentImage: {
      url: String,
      filename: String
    }
  },
  {
    versionKey: false
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
