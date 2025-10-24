const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Phone number must be valid')
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.login
);

router.get('/verify-email', authController.verifyEmail);

router.post('/email/resend', authRequired, authController.resendEmailVerification);

router.post(
  '/phone/request',
  authRequired,
  [body('phoneNumber').isMobilePhone().withMessage('Phone number must be valid')],
  authController.requestPhoneVerification
);

router.post(
  '/phone/verify',
  authRequired,
  [body('code').isLength({ min: 4 }).withMessage('Code is required')],
  authController.verifyPhone
);

module.exports = router;
