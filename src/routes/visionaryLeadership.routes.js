const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  createLeader,
  getLeaders,
  getLeaderById,
  updateLeader,
  deleteLeader
} = require('../controllers/visionaryLeadership.controller');

router.post('/create', upload.single('image'), createLeader);
router.get('/', getLeaders);
router.get('/:id', getLeaderById);
router.put('/update/:id', upload.single('image'), updateLeader);
router.delete('/delete/:id', deleteLeader);

module.exports = router;
