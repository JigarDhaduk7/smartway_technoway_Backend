const Skill = require('../models/skill.model');
const s3Service = require('../services/s3.service');

// ✅ CREATE SKILL
exports.createSkill = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Title and image are required'
      });
    }

    const imageUrl = await s3Service.uploadFile(req.file, 'skills');

    const skill = await Skill.create({
      title,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL SKILLS
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ status: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SKILL BY ID
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE SKILL
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const updateData = {
      title: req.body.title
    };

    if (req.file) {
      // Delete old image from S3
      await s3Service.deleteFile(skill.image);
      // Upload new image
      updateData.image = await s3Service.uploadFile(req.file, 'skills');
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE SKILL
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Delete image from S3
    await s3Service.deleteFile(skill.image);
    
    // Delete skill from database
    await Skill.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
