const express = require('express');
const router = express.Router();

const upload = require('../middleware/resumeUpload');
const { applyJob, getAllApplications, deleteApplication } = require('../controllers/jobApply.controller');

router.post('/apply', upload.single('resume'), applyJob);
router.get('/applications', getAllApplications);
router.delete('/applications/:id', deleteApplication);

module.exports = router;
