// backend/models/MarketingCampaign.js
import mongoose from 'mongoose';

const marketingCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  details: { type: String, required: true },
  startDate: { type: Date, required: true },
});

export default mongoose.model('MarketingCampaign', marketingCampaignSchema);