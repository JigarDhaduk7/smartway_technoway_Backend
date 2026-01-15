const Skill = require('../models/skill.model');
const fs = require('fs');

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

    const imageBase64 = fs.readFileSync(req.file.path, 'base64');
    const base64Image = `data:${req.file.mimetype};base64,${imageBase64}`;

    const skill = await Skill.create({
      title,
      image: base64Image
    });

    fs.unlinkSync(req.file.path);

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

// ✅ UPDATE SKILL
exports.updateSkill = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title
    };

    if (req.file) {
      const imageBase64 = fs.readFileSync(req.file.path, 'base64');
      updateData.image = `data:${req.file.mimetype};base64,${imageBase64}`;
      fs.unlinkSync(req.file.path);
    }

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE SKILL
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
