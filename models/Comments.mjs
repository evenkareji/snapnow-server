import mongoose from 'mongoose';
const CommentSchema = new mongoose.Schema({
  text: String,

  created: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
