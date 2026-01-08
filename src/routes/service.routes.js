const express = require('express');
const router = express.Router();

const {
  createService,
  getServices,
  getServiceBySlug,
  updateService,
  deleteService
} = require('../controllers/service.controller');

router.post('/create', createService);
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.put('/update/:id', updateService);
router.delete('/delete/:id', deleteService);

module.exports = router;
