const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    jobType: {
      type: String, // Onsite / Remote / Hybrid
      required: true
    },
    experience: {
      type: String // 1-3 Year
    },
    openings: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      required: true
    },
    requiredSkills: {
      type: [String],
      required: true
    },
    responsibilities: {
      type: [String],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
