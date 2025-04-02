// backend/models/FinancialRecord.js
import mongoose from 'mongoose';

const financialRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Revenue', 'Expense'],
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

export default mongoose.model('FinancialRecord', financialRecordSchema);