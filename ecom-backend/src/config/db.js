const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ MongoDB connected');
    }
  } catch (error) {
    console.error('Mongo connection error', error);
    process.exit(1);
  }
};

module.exports = connectDB;
