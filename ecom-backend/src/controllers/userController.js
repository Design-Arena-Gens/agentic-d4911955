const { validationResult } = require('express-validator');
const User = require('../models/User');

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
  createdAt: user.createdAt
});

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(buildUserResponse(user));
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updates = ['name', 'phoneNumber'];
    const data = {};

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true
    });

    res.json(buildUserResponse(user));
  } catch (error) {
    next(error);
  }
};
