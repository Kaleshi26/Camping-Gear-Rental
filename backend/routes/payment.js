// backend/routes/payment.js
import express from 'express';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Create Stripe Checkout Session
router.post('/create-checkout-session', auth(['customer']), async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not defined' });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { cartItems, userId } = req.body;

  try {
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'lkr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cart',
      metadata: {
        userId: userId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Confirm Payment
router.post('/confirm-payment', auth(['customer']), async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not defined' });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    // Fetch the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the cart items
    const cartResponse = await fetch('http://localhost:5000/api/cart', {
      headers: {
        Authorization: `Bearer ${req.header('Authorization').replace('Bearer ', '')}`,
      },
    });
    const cart = await cartResponse.json();

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Save payment details to User model
    const payment = {
      totalAmount,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      paymentDate: new Date(),
      refunded: false, // Ensure refund fields are set
      refundReason: '',
      refundDate: null,
    };
    user.payments.push(payment);

    // Move cart items to rentedProducts
    user.rentedProducts.push(...cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      rentedAt: new Date(),
    })));

    // Clear the cart
    user.cart = []; // This line should clear the cart
    await user.save();

    // Verify the cart is cleared
    const updatedUser = await User.findById(req.user.userId);
    if (updatedUser.cart.length > 0) {
      console.error('Cart was not cleared properly:', updatedUser.cart);
      return res.status(500).json({ message: 'Failed to clear cart after payment' });
    }

    // Save payment details to Transaction model
    const transaction = new Transaction({
      customerId: user._id,
      customerName: user.name,
      customerEmail: user.email,
      totalAmount,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      paymentDate: new Date(),
      refunded: false, // Ensure refund fields are set
      refundReason: '',
      refundDate: null,
    });
    await transaction.save();

    res.json({ success: true, message: 'Payment successful and recorded' });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;