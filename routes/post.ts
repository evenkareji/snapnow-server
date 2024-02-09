import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js';
import User from '../models/User.js';
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
    const token = req.headers.authorization?.split(' ')[1];
    const user = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!token) {
      return res.status(401).json('認証トークンがありません');
    }
    let userId;
    try {
      userId = user.id;
      console.log(req.body.userId);
      console.log(userId);
    } catch (error) {
      return res.status(403).json('無効なトークン');
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json('投稿が見つかりません');
    }

    if (post.userId.toString() === userId) {
      await post.updateOne({ $set: { desc: req.body.desc } });

      return res.status(200).json('投稿編集に成功しました');
    } else {
      return res.status(403).json('あなたは他人の投稿に編集できません');
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: 'サーバーエラーが発生しました', error: err });
  }
});

// 投稿削除api
router.delete('/:id', async (req: any, res: any) => {
  try {
    const postId = req.params.id;
    // Authorizationヘッダーからトークンを取得
    const token = req.headers.authorization?.split(' ')[1];
    const user = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!token) {
      return res.status(401).json('認証トークンがありません');
    }
    let userId;
    try {
      userId = user.id;
    } catch (error) {
      return res.status(403).json('無効なトークン');
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json('投稿が見つかりません');
    }

    if (post.userId.toString() === userId) {
      await post.deleteOne();
      res.status(200).json('投稿を削除しました');
    } else {
      res.status(403).json('投稿を削除する権限がありません');
    }
  } catch (err) {
    res.status(500).json('サーバーエラー');
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

// いいねした人の投稿
router.get('/likes/:userId', async (req, res) => {
  try {
    const ProfileUserId = req.params.userId;

    const likingPosts = await Post.find({ likes: ProfileUserId });

    return res.status(200).json(likingPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// フォローした人の投稿
router.get('/timeline/:userId', async (req, res) => {
  try {
    const currentUser: any = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendsPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      }),
    );
    return res.status(200).json(userPosts.concat(...friendsPosts));
  } catch (err) {
    console.log(err);
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

router.post('/search/:searchPost', async (req: any, res: any) => {
  try {
    const searchPost = req.params.searchPost;

    const results = await Post.find({
      desc: { $regex: searchPost, $options: 'i' },
    }).select('desc　userId likes audioUrl');

    return res.json(results);
  } catch (error) {
    console.log(error);
  }
});

export default router;
