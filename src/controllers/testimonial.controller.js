const Testimonial = require('../models/testimonial.model');

// ✅ CREATE testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated',
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ GET testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
