
import express from 'express';
import cors from 'cors';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userOrderRoutes from './routes/userOrderRoutes.js';
import aiChatRoutes from './routes/aiChatRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Main Student Project API Routes
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', authRoutes);
app.use('/api/my-history', userOrderRoutes);
app.use('/api/ai-help', aiChatRoutes);

// Basic error handler placeholder for moved structure
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
