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
import notificationRoute from './routes/notification.routes.js';
import db from './models/index.js';

const { sequelize } = db;
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://www.astogear.com"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);-

app.use('/api/category', categoryRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/checkout', checkoutRoute);
app.use('/api/order', orderRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/users', userRoute);
app.use('/api/recipts', reciptRoute);
app.use('/api/notifications', notificationRoute);



app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));


const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://www.astogear.com"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {

  socket.on('join', (userData) => {

    const {role} = userData;
    
    if(role === 'admin' || role === 'seller') {
      socket.join('room');

    }
  })


  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully");

    // Temporarily force sync in Docker
    await sequelize.sync({ alter: true });
    console.log("✅ DB schema synchronized (alter: true)");

    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(" DB connection error:", error.message);
    process.exit(1);
  }
};

startServer();



