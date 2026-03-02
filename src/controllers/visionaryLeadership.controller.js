const VisionaryLeadership = require('../models/visionaryLeadership.model');
const s3Service = require('../services/s3.service');

exports.createLeader = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, position } = req.body;

    if (!name || !position || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Name, position and image are required'
      });
    }

    const imageUrl = await s3Service.uploadFile(req.file, 'leaders');

    const leader = await VisionaryLeadership.create({
      name,
      position,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Leader created successfully',
      data: leader
    });
  } catch (error) {
    console.error('Create Leader Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaders = async (req, res) => {
  try {
    const leaders = await VisionaryLeadership.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: leaders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaderById = async (req, res) => {
  try {
    const leader = await VisionaryLeadership.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ success: false, message: 'Leader not found' });
    }
    res.status(200).json({
      success: true,
      data: leader
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLeader = async (req, res) => {
  try {
    const leader = await VisionaryLeadership.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({
        success: false,
        message: 'Leader not found'
      });
    }

    const updateData = {
      name: req.body.name,
      position: req.body.position
    };

    if (req.file) {
      await s3Service.deleteFile(leader.image);
      updateData.image = await s3Service.uploadFile(req.file, 'leaders');
    }

    const updatedLeader = await VisionaryLeadership.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Leader updated successfully',
      data: updatedLeader
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLeader = async (req, res) => {
  try {
    const leader = await VisionaryLeadership.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({
        success: false,
        message: 'Leader not found'
      });
    }

    await s3Service.deleteFile(leader.image);
    await VisionaryLeadership.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Leader deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
