const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/me', authRequired, userController.getMe);
router.put(
  '/me',
  authRequired,
  [
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Phone must be valid')
  ],
  userController.updateMe
);

module.exports = router;
