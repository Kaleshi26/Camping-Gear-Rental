// backend/routes/contact.js
import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Submit Contact Form
router.post('/submit', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Validate request body
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new contact message
    const contact = new Contact({
      name,
      email: email.toLowerCase(),
      subject,
      message,
    });

    await contact.save();

    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (err) {
    console.error('Error submitting contact form:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;