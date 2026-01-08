const Job = require('../models/job.model');

// ✅ CREATE Job
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET All Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET Job By ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
