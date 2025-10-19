import "dotenv/config";
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js';
import checkoutRoute from './routes/checkout.routes.js';
import orderRoute from './routes/order.routes.js';
import paymentRoute from './routes/payment.routes.js';
import userRoute from './routes/user.routes.js';
import reciptRoute from './routes/recipt.routes.js';

import db from './models/index.js';

const { sequelize } = db;
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/checkout', checkoutRoute);
app.use('/api/order', orderRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/users', userRoute);
app.use('/api/recipts', reciptRoute);

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully✅");

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log("DB schema synchronized (alter: true)");
    } else {
      console.log('🚫 Skipping sync in production. Use migrations.');
    }

    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ DB connection error:", error.message);
    process.exit(1);
  }
};

startServer();