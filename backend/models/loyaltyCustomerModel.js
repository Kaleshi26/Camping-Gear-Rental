
import mongoose from "mongoose";

const loyaltyCustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    match: [/^0\d{9}$/, "Please enter a valid phone number"],
  },
  loyaltyTier: {
    type: String,
    required: true,
    enum: ["bronze", "silver", "gold", "platinum"], 
    default: "bronze",
  },
  points: {
    type: Number,
    required: true,
    default: 0, 
    min: 0, 
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now, 
  },
  offers: [{
    offerCode: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isRedeemed: {
      type: Boolean,
      default: false,
    }
  }],
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive", "suspended"], 
    default: "active",
  },
});

export default mongoose.model("LoyaltyCustomer", loyaltyCustomerSchema);