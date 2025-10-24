const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerificationCodeHash: String,
    phoneVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.setPassword = async function setPassword(password) {
  const saltRounds = 10;
  this.passwordHash = await bcrypt.hash(password, saltRounds);
};

userSchema.methods.generateEmailVerificationToken = function generateEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 1000 * 60 * 60; // 1 hour
  return token;
};

userSchema.methods.setPhoneVerificationCode = async function setPhoneVerificationCode(code) {
  const saltRounds = 10;
  this.phoneVerificationCodeHash = await bcrypt.hash(code, saltRounds);
  this.phoneVerificationExpires = Date.now() + 1000 * 60 * 10; // 10 minutes
};

userSchema.methods.clearVerification = function clearVerification() {
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
  this.phoneVerificationCodeHash = undefined;
  this.phoneVerificationExpires = undefined;
};

module.exports = mongoose.model('User', userSchema);
