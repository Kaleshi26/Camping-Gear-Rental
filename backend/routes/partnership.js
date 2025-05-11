// backend/routes/partnership.js
import express from 'express';
import Partnership from '../models/Partnership.js';

const router = express.Router();

// Submit Partnership Form
router.post('/submit', async (req, res) => {
  const { title, contactNumber, partnershipType, message, userEmail } = req.body;
  const userEmailFromAuth = req.user ? req.user.email : null; // Use authenticated user email if available

  try {
    if (!title || !contactNumber || !partnershipType || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!/^\+?[\d\s-]{10,}$/.test(contactNumber)) {
      return res.status(400).json({ message: 'Invalid contact number format' });
    }

    const partnership = new Partnership({
      title,
      contactNumber,
      partnershipType,
      message,
      userEmail: userEmail || userEmailFromAuth, // Use provided userEmail or authenticated email
    });

    await partnership.save();

    res.status(201).json({ message: 'Partnership request submitted successfully' });
  } catch (err) {
    console.error('Error submitting partnership form:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch All Partnerships
router.get('/partnerships', async (req, res) => {
  try {
    const partnerships = await Partnership.find(); // Fetch all partnerships from the database
    res.json(partnerships); // Return the data as JSON
  } catch (err) {
    console.error('Error fetching partnerships:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;