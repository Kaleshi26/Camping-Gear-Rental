// backend/routes/user.js
import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile (for customers)
router.get('/profile', auth(['customer']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with discount data (for marketing manager)
router.get('/discounts', auth(['marketing_manager']), async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('name email payments loyaltyPoints');
    const usersWithDiscounts = users
      .map(user => ({
        name: user.name,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        discounts: user.payments
          .filter(payment => payment.discountApplied > 0)
          .map(payment => ({
            totalAmount: payment.totalAmount,
            discountApplied: payment.discountApplied,
            paymentDate: payment.paymentDate,
          })),
      }))
      .filter(user => user.discounts.length > 0); // Only include users who have received discounts
    res.json(usersWithDiscounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;