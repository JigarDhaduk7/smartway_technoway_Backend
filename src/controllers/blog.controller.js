const Blog = require('../models/blog.model');
const s3Service = require('../services/s3.service');

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

    const imageUrl = await s3Service.uploadFile(req.file, 'blogs');

    const blog = await Blog.create({
      title,
      slug,
      image: imageUrl,
      content
    });

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
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const updateData = {
      title: req.body.title,
      content: req.body.content
    };

    if (req.file) {
      // Delete old image from S3
      await s3Service.deleteFile(blog.image);
      // Upload new image
      updateData.image = await s3Service.uploadFile(req.file, 'blogs');
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Delete image from S3
    await s3Service.deleteFile(blog.image);
    
    // Delete blog from database
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
