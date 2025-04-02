// backend/routes/rentals.js
import express from 'express';
import Rental from '../models/Rental.js';

const router = express.Router();

// GET /rentals - Fetch all rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.status(200).json(rentals);
  } catch (err) {
    console.error('Error fetching rentals:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /rentals - Create a new rental
router.post('/', async (req, res) => {
  const { customerId, totalPrice, rentalDate, returnDate, status } = req.body;

  // Validate required fields
  if (!customerId || !totalPrice || !rentalDate || !returnDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newRental = new Rental({
      customerId,
      totalPrice,
      rentalDate,
      returnDate,
      status: status || 'Pending', // Default to 'Pending' if not provided
    });

    const savedRental = await newRental.save();
    res.status(201).json(savedRental);
  } catch (err) {
    console.error('Error creating rental:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /rentals/:id - Update rental status
router.put('/:id', async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    rental.status = status;
    const updatedRental = await rental.save();
    res.status(200).json(updatedRental);
  } catch (err) {
    console.error('Error updating rental:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /rentals/:id - Delete a rental
router.delete('/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    await Rental.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Rental deleted successfully' });
  } catch (err) {
    console.error('Error deleting rental:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;