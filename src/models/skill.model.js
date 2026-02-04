const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String, // S3 URL
      required: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
