const Post = require('../models/Post');

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.getPosts = async (req, res, next) => {
  try {
    const { tag, page = 1, limit = 10 } = req.query;
    const filter = tag ? { tags: { $regex: new RegExp(tag, 'i') } } : {};
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(filter).populate('author', 'name email').skip(skip).limit(+limit),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { total, page: +page, pages: Math.ceil(total / limit) },
    });
  } catch (err) { next(err); }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    Object.assign(post, req.body);
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
};