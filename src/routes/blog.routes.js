const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../controllers/blog.controller');

router.post('/create', upload.single('image'), createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.put('/update/:id', upload.single('image'), updateBlog);
router.delete('/delete/:id', deleteBlog);

module.exports = router;
