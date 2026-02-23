import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

connectDb();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.clientUrls.includes(origin) || origin === config.clientUrl) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'water-lab-tracker-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API running on port ${config.port}`);
});
