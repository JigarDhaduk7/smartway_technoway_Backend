const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  createService,
  getServices,
  getServiceBySlug,
  updateService,
  deleteService
} = require('../controllers/service.controller');

// Multiple file upload fields for service icons
const serviceUpload = upload.fields([
  { name: 'cardIcon', maxCount: 1 },
  { name: 'serviceIcon0', maxCount: 1 },
  { name: 'serviceIcon1', maxCount: 1 },
  { name: 'serviceIcon2', maxCount: 1 },
  { name: 'serviceIcon3', maxCount: 1 },
  { name: 'serviceIcon4', maxCount: 1 },
  { name: 'stepIcon0', maxCount: 1 },
  { name: 'stepIcon1', maxCount: 1 },
  { name: 'stepIcon2', maxCount: 1 },
  { name: 'stepIcon3', maxCount: 1 },
  { name: 'stepIcon4', maxCount: 1 }
]);

router.post('/create', serviceUpload, createService);
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.put('/update/:id', serviceUpload, updateService);
router.delete('/delete/:id', deleteService);

module.exports = router;
