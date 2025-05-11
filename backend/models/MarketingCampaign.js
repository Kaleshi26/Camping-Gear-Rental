// backend/models/MarketingCampaign.js
import mongoose from 'mongoose';

const marketingCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  details: { type: String, required: true },
  startDate: { type: Date, required: true },
  checked: { type: Boolean, default: false }, // Added to track admin check
});

export default mongoose.model('MarketingCampaign', marketingCampaignSchema);