// backend/routes/finance.js
import express from 'express';
import auth from '../middleware/auth.js';
import FinancialRecord from '../models/FinancialRecord.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const router = express.Router();

// Get all financial records
router.get('/records', auth(['finance_manager']), async (req, res) => {
  try {
    const records = await FinancialRecord.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error('Error fetching financial records:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add financial record
router.post('/records', auth(['finance_manager']), async (req, res) => {
  const { type, amount, description, date } = req.body;

  if (!type || !amount || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const record = new FinancialRecord({ type, amount, description, date });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    console.error('Error adding financial record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete financial record
router.delete('/records/:id', auth(['finance_manager']), async (req, res) => {
  try {
    const record = await FinancialRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting financial record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions
router.get('/transactions', auth(['finance_manager']), async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ paymentDate: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily rental income report
router.get('/daily-report', auth(['finance_manager']), async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const transactions = await Transaction.find({
      paymentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ paymentDate: -1 });

    res.json(transactions);
  } catch (err) {
    console.error('Error generating daily report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly revenue summary report
router.get('/monthly-report', auth(['finance_manager']), async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: 'Month is required' });
  }

  try {
    const [year, monthIndex] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthIndex - 1, 1);
    const endOfMonth = new Date(year, monthIndex, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      paymentDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }).sort({ paymentDate: -1 });

    res.json({ transactions });
  } catch (err) {
    console.error('Error generating monthly report:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process refund
router.post('/refund/:transactionId', auth(['finance_manager']), async (req, res) => {
  const { transactionId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: 'Refund reason is required' });
  }

  try {
    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.refunded) {
      return res.status(400).json({ message: 'Transaction already refunded' });
    }

    // Mark the transaction as refunded
    transaction.refunded = true;
    transaction.refundReason = reason;
    transaction.refundDate = new Date();
    await transaction.save();

    // Update the user's payment record
    const user = await User.findById(transaction.customerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const payment = user.payments.find(
      (p) =>
        p.paymentDate.toISOString() === transaction.paymentDate.toISOString() &&
        p.totalAmount === transaction.totalAmount
    );
    if (payment) {
      payment.refunded = true;
      payment.refundReason = reason;
      payment.refundDate = new Date();
      await user.save();
    }

    res.json({ message: 'Refund processed successfully' });
  } catch (err) {
    console.error('Error processing refund:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;