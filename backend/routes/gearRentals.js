// backend/routes/gearRentals.js
import express from 'express';
import GearRental from '../models/GearRental.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new gear rental
router.post('/', auth(), async (req, res) => {
  try {
    console.log('Received gear rental request:', req.body);

    const { customerId, productId, quantity, rentalDate, returnDate, status } = req.body;

    if (!customerId || !productId || !quantity || !rentalDate || !returnDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const gearRental = new GearRental({
      customerId,
      productId,
      quantity,
      rentalDate,
      returnDate,
      status: status || 'Pending',
    });

    const savedRental = await gearRental.save();
    console.log('Gear rental saved:', savedRental);

    res.status(201).json(savedRental);
  } catch (err) {
    console.error('Error saving gear rental:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all gear rentals
router.get('/', auth(), async (req, res) => {
  try {
    const gearRentals = await GearRental.find();
    res.json(gearRentals);
  } catch (err) {
    console.error('Error fetching gear rentals:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
