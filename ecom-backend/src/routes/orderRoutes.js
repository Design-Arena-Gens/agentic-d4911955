const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  authRequired,
  [
    body('items').isArray({ min: 1 }).withMessage('Items are required'),
    body('items.*.productId').isString().withMessage('Product ID required'),
    body('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  orderController.createOrder
);

router.get('/:id', authRequired, orderController.getOrderById);
router.get('/', authRequired, orderController.getOrders);

module.exports = router;
