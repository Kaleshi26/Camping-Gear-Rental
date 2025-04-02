// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        'customer',
        'inventory_manager',
        'finance_manager',
        'rental_manager',
        'marketing_manager',
        'admin',
        'gear_host',
      ],
      default: 'customer',
    },
    rentedProducts: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        rentedAt: { type: Date, default: Date.now },
      },
    ],
    cart: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    hostedGears: [
      {
        gearId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gear', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        availability: { type: Boolean, default: true },
        image: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    payments: [
      {
        totalAmount: { type: Number, required: true },
        items: [
          {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String },
          },
        ],
        paymentDate: { type: Date, default: Date.now },
        refunded: { type: Boolean, default: false }, // Added
        refundReason: { type: String, default: '' }, // Added
        refundDate: { type: Date, default: null }, // Added
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;