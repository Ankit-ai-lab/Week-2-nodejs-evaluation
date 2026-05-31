const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {
  createPost, getPosts, getPost, updatePost, deletePost
} = require('../controllers/postController');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;