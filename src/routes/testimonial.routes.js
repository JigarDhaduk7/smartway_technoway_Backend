const express = require('express');
const router = express.Router();

const {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialById
} = require('../controllers/testimonial.controller');

router.post('/create', createTestimonial);        // CREATE
router.get('/', getTestimonials);                 // GET
router.put('/update/:id', updateTestimonial);     // UPDATE
router.delete('/delete/:id', deleteTestimonial);  // DELETE
router.get('/:id', getTestimonialById);

module.exports = router;
