// import express from 'express';
// import catchAsync from '../utilities/catch-async.js';
// import { authenticateAdmin } from '../middleware.js';
// import {
//   addCoupon,
//   deleteCoupon,
//   getAllCoupons
// } from '../controllers/coupon.js';
// const router = express.Router();

// router
//   .route('/')
//   .get(authenticateAdmin, catchAsync(getAllCoupons))
//   .post(authenticateAdmin, catchAsync(addCoupon));
// router.route('/:id').delete(authenticateAdmin, catchAsync(deleteCoupon));

// export default router;






import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import { authenticateAdmin } from '../middleware.js';
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons
} from '../controllers/coupon.js';
const router = express.Router();

router
  .route('/')
  .get(authenticateAdmin, catchAsync(getAllCoupons))
  .post(authenticateAdmin, catchAsync(addCoupon));
router.route('/:id').delete(authenticateAdmin, catchAsync(deleteCoupon));

export default router;


// import express from 'express';
// import catchAsync from '../utilities/catch-async.js';
// import { authenticateAdmin } from '../middleware.js';
// import {
//   addCoupon,
//   deleteCoupon,
//   getAllCoupons,
//   updateCouponCount // Assuming this is the function you want to call with the PUT request
// } from '../controllers/coupon.js'; // Make sure to import the appropriate function for updating the coupon count
// const router = express.Router();

// router
//   .route('/')
//   .get(authenticateAdmin, catchAsync(getAllCoupons))
//   .post(authenticateAdmin, catchAsync(addCoupon));

// router
//   .route('/:id')
//   .delete(authenticateAdmin, catchAsync(deleteCoupon))
//   .put(authenticateAdmin, catchAsync(updateCouponCount)); // Set route for the PUT request here

// export default router;

