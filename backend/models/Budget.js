// backend/models/Budget.js
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    enum: ['Marketing', 'Inventory', 'Operations'],
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Budget', budgetSchema);