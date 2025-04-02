// backend/models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    },
  ],
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  refunded: {
    type: Boolean,
    default: false,
  },
  refundReason: {
    type: String,
    default: '',
  },
  refundDate: {
    type: Date,
    default: null,
  },
});

export default mongoose.model('Transaction', transactionSchema);