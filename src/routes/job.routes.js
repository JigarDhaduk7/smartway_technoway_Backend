const express = require('express');
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/job.controller');

router.post('/create', createJob);        // CREATE
router.get('/', getJobs);                 // GET ALL
router.get('/:id', getJobById);            // GET BY ID
router.put('/update/:id', updateJob);      // UPDATE
router.delete('/delete/:id', deleteJob);   // DELETE

module.exports = router;
