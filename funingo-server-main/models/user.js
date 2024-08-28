import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    phone_no: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "others"],
    },
    dob: {
      type: Date,
      required: true,
    },
    reg_date: {
      type: Date,
      required: false,
    },
    hash_password: String,
    city: String,
    state: String,
    locality: String, // If city === 'jabalpur'
    verified: Boolean,
    profile_picture: {
      type: String,
      enum: ["m1", "m2", "m3", "m4", "f1", "f2", "f3", "f4"],
      required: false,
      default: "m1",
    },
    // funingo_coins
    funingo_money: {
      type: Number,
      default: 0,
    },
    booked_tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    user_type: {
      type: String,
      enum: ["customer", "employee", "admin", "window_employee"],
      default: "customer",
    },

    premium: [
      {
        expires_on: {
          type: Date,
          required: true,
        },
        premium_type: {
          type: String,
          enum: ["50%", "100%"],
          required: true,
        },
        premium_duration: {
          type: String,
          required: true,
          enum: ["6_months", "1_year", "100_years"],
        },
        buy_date: {
          type: Date,
          required: true,
          default: new Date(),
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
