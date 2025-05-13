// backend/routes/marketing.js
import express from 'express';
import auth from '../middleware/auth.js';
import MarketingCampaign from '../models/MarketingCampaign.js';

const router = express.Router();

// Get all marketing campaigns
router.get('/campaigns', auth(['marketing_manager', 'admin']), async (req, res) => {
  try {
    const campaigns = await MarketingCampaign.find().sort({ startDate: -1 });
    res.json(campaigns);
  } catch (err) {
    console.error('Error fetching marketing campaigns:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a marketing campaign
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
    console.error('Error creating marketing campaign:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check (approve) a marketing campaign
router.post('/campaigns/:id/check', auth(['admin']), async (req, res) => {
  try {
    const campaign = await MarketingCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    if (campaign.checked) {
      return res.status(400).json({ message: 'Campaign already checked' });
    }
    campaign.checked = true;
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    console.error('Error checking campaign:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a marketing campaign
router.delete('/campaigns/:id', auth(['marketing_manager', 'admin']), async (req, res) => {
  try {
    const deleted = await MarketingCampaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    console.error('Error deleting campaign:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
