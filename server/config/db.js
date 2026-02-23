import mongoose from 'mongoose';
import config from './config.js';

const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDb;
