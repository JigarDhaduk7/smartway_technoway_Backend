const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    card: {
      shortDescription: String,
      icon: String
    },
    heroSection: {
      headline: String,
      subHeadline: String
    },
    servicesOverview: {
      title: String,
      description: String,
      services: [
        {
          id: String,
          title: String,
          description: String,
          icon: String
        }
      ]
    },
    processSection: {
      title: String,
      steps: [
        {
          step: Number,
          title: String,
          icon: String
        }
      ]
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
