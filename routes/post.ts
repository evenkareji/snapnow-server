import express from 'express';
const router = express.Router();
import Post from '../models/Post.mjs';
import User from '../models/User';
// 投稿
router.post('/', async (req, res) => {
  try {
    const newPost = await new Post(req.body);

    const result = await newPost.save();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// 自分の全ての投稿
router.get('/profile/:username', async (req, res) => {
  try {
    const user: any = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// 全投稿
router.get('/', async (req, res) => {
  try {
    const result = await Post.find();

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// 投稿編集api
router.put('/:id', async (req, res) => {
  try {
    const post: any = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json('投稿編集に成功しました');
    } else {
      return res.status(200).json('あなたは他人の投稿に編集できません');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
// 投稿削除api
router.delete('/:id', async (req, res) => {
  try {
    //投稿したidを取得
    const post: any = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json('投稿を削除しました');
    } else {
      res.status(403).json('投稿を削除できません');
    }
  } catch (err) {
    res.status(403).json(err);
  }
});
// 自分投稿取得
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// いいねを押す
router.put('/:id/like', async (req, res) => {
  try {
    let isLike = false;
    const post: any = await Post.findById(req.params.id);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: { likes: req.body.userId },
      });
      isLike = true;

      return res.status(200).json(isLike);
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      isLike = false;

      return res.status(200).json(isLike);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
