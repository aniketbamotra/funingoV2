import axios from "axios";
import { apiUrl } from "../constants";

export const windowPurchase = async ({
  total_amount,
  details,
  token,
  phone_no,
  payment_mode,
  coupon,
  dob,
}) => {
  console.log("details from exployee.js", details);
  const response = await axios.post(
    `${apiUrl}/ticket/e/book-ticket`,
    { total_amount, details, phone_no, payment_mode, coupon, dob },
    {
      headers: {
        token,
      },
    }
  );
  console.log("response from exployee", response);
  return response.data;
};
