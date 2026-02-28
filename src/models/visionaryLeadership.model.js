const mongoose = require('mongoose');

const visionaryLeadershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisionaryLeadership', visionaryLeadershipSchema);
