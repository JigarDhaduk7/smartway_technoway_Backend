const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const {
  createProject,
  getProjects,
  getProjectBySlug,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');

router.post('/create', upload.single('image'), createProject);
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.put('/update/:id', upload.single('image'), updateProject);
router.delete('/delete/:id', deleteProject);

module.exports = router;
