// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/products.js';
import rentalRoutes from './routes/rentals.js';
import financeRoutes from './routes/finance.js';
import marketingRoutes from './routes/marketing.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';

import reviewRoutes from "./routes/review.js"; // Import the reviews routes
import contactRoutes from './routes/contact.js'; //new line for contact
import partnershipRoutes from './routes/partnership.js'; //new 2nd line for partnership
import employeeRoutes from './routes/employees.js';
import gearRentalRoutes from './routes/gearRentals.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Routes
app.use("/api/reviews", reviewRoutes); // Mount the reviews routes
app.use('/api/contact', contactRoutes); // Mount the contact routes
app.use('/api/partnership', partnershipRoutes);  //new for partnership
app.use('/api/employees', employeeRoutes);
app.use('/api/gear-rentals', gearRentalRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));