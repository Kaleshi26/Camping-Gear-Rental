// backend/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await User.deleteMany({});
    console.log('Existing users cleared');

    const users = [
      {
        name: 'Admin',
        email: 'admin@campease.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      },
      {
        name: 'Inventory Manager',
        email: 'inventory@campease.com',
        password: await bcrypt.hash('inventory123', 10),
        role: 'inventory_manager',
      },
      {
        name: 'Finance Manager',
        email: 'finance@campease.com',
        password: await bcrypt.hash('finance123', 10),
        role: 'finance_manager',
      },
      {
        name: 'Rental Manager',
        email: 'rental@campease.com',
        password: await bcrypt.hash('rental123', 10),
        role: 'rental_manager',
      },
      {
        name: 'Marketing Manager',
        email: 'marketing@campease.com',
        password: await bcrypt.hash('marketing123', 10),
        role: 'marketing_manager',
      },
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');

    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding users:', err);
    mongoose.connection.close();
  }
};

seedUsers();