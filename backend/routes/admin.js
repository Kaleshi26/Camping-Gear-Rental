// backend/routes/admin.js
import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Rental from '../models/Rental.js';
import FinancialRecord from '../models/FinancialRecord.js';

const router = express.Router();

router.get('/stats', auth(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const newUsers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const rentals = await Rental.find();
    const newOrders = rentals.filter(
      (rental) => rental.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;
    const financialRecords = await FinancialRecord.find();
    const totalRevenue = financialRecords
      .filter((record) => record.type === 'Revenue')
      .reduce((sum, record) => sum + record.amount, 0);

    res.json({
      totalRevenue,
      newOrders,
      newUsers,
      totalUsers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;