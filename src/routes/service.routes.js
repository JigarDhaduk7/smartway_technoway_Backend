const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  createService,
  getServices,
  getServiceBySlug,
  updateService,
  deleteService
} = require('../controllers/service.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create', upload.any(), createService);
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.put('/update/:id', upload.any(), updateService);
router.delete('/delete/:id', deleteService);

module.exports = router;
