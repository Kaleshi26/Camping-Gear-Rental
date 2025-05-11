// backend/models/GearRental.js
import mongoose from 'mongoose';

const gearRentalSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  rentalDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected', 'Returned'],
    default: 'Pending',
  },
}, { timestamps: true });

export default mongoose.model('GearRental', gearRentalSchema);