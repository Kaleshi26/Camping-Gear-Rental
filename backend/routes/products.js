// backend/routes/products.js
import express from 'express';
import auth from '../middleware/auth.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth(['inventory_manager']), async (req, res) => {
  const { name, price, image, category, stock, status } = req.body;

  if (!name || !price || !image || !category || !stock) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const product = new Product({ name, price, image, category, stock, status });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth(['inventory_manager']), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth(['inventory_manager']), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/rent', auth(['customer']), async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock -= quantity;
    await product.save();

    const user = await User.findById(req.user.userId);
    user.rentedProducts.push({
      productId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      rentedAt: new Date(),
    });
    await user.save();

    res.json({ message: 'Product rented successfully' });
  } catch (err) {
    console.error('Error renting product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/return', auth(['inventory_manager']), async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock += quantity;
    await product.save();

    res.json({ message: 'Product returned successfully' });
  } catch (err) {
    console.error('Error returning product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;