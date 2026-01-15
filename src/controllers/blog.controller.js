const Blog = require('../models/blog.model');
const fs = require('fs');

// ✅ CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const { title, slug, content } = req.body;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Slug is required'
      });
    }

    // slug unique check
    const slugExists = await Blog.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists'
      });
    }

    const imageBase64 = fs.readFileSync(req.file.path, 'base64');
    const base64Image = `data:${req.file.mimetype};base64,${imageBase64}`;

    const blog = await Blog.create({
      title,
      slug,
      image: base64Image,
      content
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ GET ALL BLOGS
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content
    };

    if (req.file) {
      const imageBase64 = fs.readFileSync(req.file.path, 'base64');
      updateData.image = `data:${req.file.mimetype};base64,${imageBase64}`;
      fs.unlinkSync(req.file.path);
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
