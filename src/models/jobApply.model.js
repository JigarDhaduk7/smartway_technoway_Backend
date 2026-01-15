const mongoose = require('mongoose');

const jobApplySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true }, // job title
    about: { type: String, required: true },

    resume: {
      fileName: String,
      mimeType: String,
      oneDriveFileId: String,
      oneDriveUrl: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplySchema);
