import "dotenv/config"
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import brandRoutes from './routes/brand.routes.js'
import checkoutRoute from './routes/checkout.routes.js'
import orderRoute from './routes/order.routes.js'
import paymentRoute from './routes/payment.routes.js'

import db from './models/index.js';
import cors from 'cors';
const {sequelize} = db;
const app = express();

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true,
}))
app.use(express.json());

app.use(cookieParser());

app.use('/api/products',productRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/brand',brandRoutes);
app.use('/api/checkout',checkoutRoute);
app.use('/api/order',orderRoute);
app.use('/api/payment', paymentRoute);



const PORT = process.env.PORT ;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected successfully✅");

    if(process.env.NODE_ENV === 'development'){
      await sequelize.sync();
      console.log("DB schema synchronized (alter : true)")

    } else {
      console.log('🚫 Skipping sync in production. Use migrations.');
    }

    app.listen(PORT, () => {    
      console.log(`Server is running at http://localhost:${PORT}`)
    });
  }catch(error){
    console.log("❌ DB connection error : ", error.message);
    process.exit(1);
  }
};
startServer();