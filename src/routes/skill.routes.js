const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill
} = require('../controllers/skill.controller');

router.post('/create', upload.single('image'), createSkill);
router.get('/', getSkills);
router.get('/:id', getSkillById);
router.put('/update/:id', upload.single('image'), updateSkill);
router.delete('/delete/:id', deleteSkill);

module.exports = router;
