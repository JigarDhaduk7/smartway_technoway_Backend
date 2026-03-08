const JobApplication = require('../models/jobApply.model');
const s3Service = require('../services/s3.service');

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

    // Upload to S3
    const s3Url = await s3Service.uploadFile(req.file, 'resumes');

    // Save to DB
    const application = await JobApplication.create({
      fullName,
      email,
      subject,
      about,
      resume: {
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        s3Url
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

// ✅ GET ALL APPLICATIONS
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ DELETE APPLICATION
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Delete from S3
    if (application.resume?.s3Url) {
      await s3Service.deleteFile(application.resume.s3Url);
    }

    await JobApplication.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
