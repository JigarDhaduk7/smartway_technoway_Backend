const JobApplication = require('../models/jobApply.model');
const { uploadToOneDrive } = require('../services/oneDrive.service');

// ✅ APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const { fullName, email, subject, about } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    // Upload to OneDrive
    const oneDriveFile = await uploadToOneDrive(
      req.file.buffer,
      Date.now() + '-' + req.file.originalname,
      req.file.mimetype
    );

    // Save to DB
    const application = await JobApplication.create({
      fullName,
      email,
      subject,
      about,
      resume: {
        fileName: oneDriveFile.name,
        mimeType: req.file.mimetype,
        oneDriveFileId: oneDriveFile.id,
        oneDriveUrl: oneDriveFile.webUrl
      }
    });

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
