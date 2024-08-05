import express from 'express';
import catchAsync from '../utilities/catch-async.js';
import {
  fetchSelf,
  loginUser,
  registerUser,
  forgetPassword,
  validateAndUpdatePassword,
  updateUser,
  getFreebies,
  getFreebiesFromPhnNo,
  createPremiumOrder,
  verifyPremiumPayment
} from '../controllers/user.js';
import { authenticateEmployee, authenticateUser } from '../middleware.js';
const router = express.Router();

router
  .route('/')
  .post(catchAsync(registerUser))
  .get(authenticateUser, catchAsync(fetchSelf))
  .put(authenticateUser, catchAsync(updateUser));

router.route('/login').post(catchAsync(loginUser));
router.route('/forget-password').post(catchAsync(forgetPassword));
router
  .route('/validate-and-update-password')
  .post(catchAsync(validateAndUpdatePassword));

router.get('/freebies', authenticateUser, catchAsync(getFreebies));

router
  .route('/premium/create-order')
  .post(authenticateUser, catchAsync(createPremiumOrder));
router
  .route('/premium/verify-payment')
  .post(authenticateUser, catchAsync(verifyPremiumPayment));

router.get(
  '/freebies/:phone_no',
  authenticateEmployee,
  catchAsync(getFreebiesFromPhnNo)
);

export default router;
