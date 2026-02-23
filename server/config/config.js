import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/waterlab',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  clientUrls: (process.env.CLIENT_URLS || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
};

export default config;
