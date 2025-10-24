const jwt = require('jsonwebtoken');

const generateToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const defaultOptions = {
    expiresIn: '7d'
  };

  return jwt.sign(payload, secret, { ...defaultOptions, ...options });
};

module.exports = generateToken;
