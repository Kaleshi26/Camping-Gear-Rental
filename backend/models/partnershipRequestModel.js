import mongoose from "mongoose";

const partnershipRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    match: [/^0\d{9}$/, "Please enter a valid phone number"], 
  },
  email: {
    type: String,
    required: true,
  },
  partnershipType: {
    type: String,
    required: true,
    enum: ["travel", "influencer", "affiliate", "event", "custom"],
  },
  requestDate: {
    type: Date,
    required: true,
    default: Date.now, 
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"], 
    default: "pending",
  },
});

export default mongoose.model("PartnershipRequest", partnershipRequestSchema);