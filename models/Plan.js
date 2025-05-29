import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
    required: true,
  }],
  duration: {
    type: Number,  // Duration in days
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan; 