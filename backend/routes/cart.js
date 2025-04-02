// backend/routes/cart.js
import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get cart
router.get('/', auth(['customer']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ items: user.cart || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to cart
router.post('/add', auth(['customer']), async (req, res) => {
  const { productId, name, price, quantity, image } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = { productId, name, price, quantity, image };
    if (!user.cart) user.cart = [];
    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push(cartItem);
    }

    await user.save();
    res.json({ items: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quantity
router.put('/update', auth(['customer']), async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.cart.findIndex((item) => item.productId === productId);
    if (itemIndex >= 0) {
      user.cart[itemIndex].quantity = quantity;
      await user.save();
      res.json({ items: user.cart });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item
router.delete('/remove/:productId', auth(['customer']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter((item) => item.productId !== req.params.productId);
    await user.save();
    res.json({ items: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', auth(['customer']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;