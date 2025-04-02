// backend/routes/marketing.js
import express from 'express';
import auth from '../middleware/auth.js';
import MarketingCampaign from '../models/MarketingCampaign.js';

const router = express.Router();

router.get('/campaigns', auth(['marketing_manager', 'admin']), async (req, res) => {
  try {
    const campaigns = await MarketingCampaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/campaigns', auth(['marketing_manager']), async (req, res) => {
  const { name, type, details, startDate } = req.body;

  if (!name || !type || !details || !startDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const campaign = new MarketingCampaign({ name, type, details, startDate });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/campaigns/:id', auth(['marketing_manager']), async (req, res) => {
  try {
    await MarketingCampaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;