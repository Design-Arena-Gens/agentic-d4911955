const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { items, shippingAddress } = req.body;

  try {
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }

      total += product.price * item.qty;
      orderItems.push({
        productId: product._id,
        qty: item.qty,
        priceAtPurchase: product.price
      });

      product.stock -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      total
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.productId').populate('userId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.userId = req.user._id;
    } else if (req.query.user) {
      filter.userId = req.query.user;
    }

    const orders = await Order.find(filter)
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};
