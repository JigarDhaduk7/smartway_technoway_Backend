const express = require('express');
const router = express.Router();

const upload = require('../middleware/resumeUpload');
const { applyJob } = require('../controllers/jobApply.controller');

router.post('/apply', upload.single('resume'), applyJob);

module.exports = router;
