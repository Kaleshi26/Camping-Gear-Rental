// backend/models/Partnership.js
import mongoose from 'mongoose';

const partnershipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    partnershipType: {
      type: String,
      required: true,
      enum: ['travel', 'influencer', 'affiliate', 'event', 'custom'],
    },
    message: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
    },
  },
  { timestamps: true }
);

const Partnership = mongoose.model('Partnership', partnershipSchema);
export default Partnership;