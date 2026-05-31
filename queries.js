const Post = require('./models/Post');
const User = require('./models/User');
const mongoose = require('mongoose');


async function popularPosts() {
  return Post.find({ likes: { $gt: 10 } })
    .sort({ likes: -1 })
    .select('title likes createdAt');
}


async function gmailUsers() {
  return User.find({ email: /@gmail\.com$/, role: 'user' });
}

async function techPosts() {
  return Post.find({
    tags: { $in: [/nodejs/i, /mongodb/i] }
  });
}


async function likeAllByAuthor(authorId) {
  return Post.updateMany(
    { author: new mongoose.Types.ObjectId(authorId) },
    { $inc: { likes: 1 } }
  );
}


async function deleteStale() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return Post.deleteMany({ createdAt: { $lt: cutoff }, likes: 0 });
}


async function postCountPerAuthor() {
  return Post.aggregate([
    { $group: { _id: '$author', postCount: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'author' } },
    { $project: { postCount: 1, 'author.name': 1, 'author.email': 1 } },
  ]);
}


async function topAuthorsByLikes() {
  return Post.aggregate([
    { $group: { _id: '$author', totalLikes: { $sum: '$likes' } } },
    { $sort: { totalLikes: -1 } },
    { $limit: 3 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'author' } },
  ]);
}


async function monthlyActivity() {
  return Post.aggregate([
    {
      $group: {
        _id: {
          year:  { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
}


async function tagPopularity() {
  return Post.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}


async function authorsWithNoPosts() {
  return User.aggregate([
    {
      $lookup: {
        from: 'posts', localField: '_id', foreignField: 'author', as: 'posts'
      },
    },
    { $match: { posts: { $size: 0 } } },
    { $project: { name: 1, email: 1 } },
  ]);
}

module.exports = {
  popularPosts, gmailUsers, techPosts, likeAllByAuthor, deleteStale,
  postCountPerAuthor, topAuthorsByLikes, monthlyActivity, tagPopularity, authorsWithNoPosts,
};