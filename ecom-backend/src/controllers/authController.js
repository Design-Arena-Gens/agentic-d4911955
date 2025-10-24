const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { sendVerificationCode, checkVerificationCode } = require('../utils/sendSMS');
const { ROLES } = require('../config/constants');

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phoneNumber: user.phoneNumber,
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
  createdAt: user.createdAt
});

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phoneNumber } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User({
      name,
      email,
      phoneNumber,
      role: ROLES.USER
    });

    await user.setPassword(password);
    const emailToken = user.generateEmailVerificationToken();
    await user.save();

    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
    const verifyUrl = `${clientOrigin}/verify-email?token=${emailToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      html: `<p>Hi ${user.name},</p><p>Please verify your email address by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p><p>This link expires in 1 hour.</p>`
    });

    if (phoneNumber) {
      await sendVerificationCode(phoneNumber);
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      token,
      user: buildUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({ token, user: buildUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'Verification token required' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalid or expired' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

exports.resendEmailVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const token = user.generateEmailVerificationToken();
    await user.save();

    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
    const verifyUrl = `${clientOrigin}/verify-email?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      html: `<p>Hi ${user.name},</p><p>Please verify your email address by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p>`
    });

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

exports.requestPhoneVerification = async (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.phoneNumber = phoneNumber;
    await sendVerificationCode(phoneNumber);
    await user.save();

    res.json({ message: 'Verification code sent' });
  } catch (error) {
    next(error);
  }
};

exports.verifyPhone = async (req, res, next) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Verification code required' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.phoneNumber) {
      return res.status(404).json({ message: 'Phone number not found' });
    }

    const valid = await checkVerificationCode(user.phoneNumber, code);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    user.phoneVerified = true;
    await user.save();
    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    next(error);
  }
};
