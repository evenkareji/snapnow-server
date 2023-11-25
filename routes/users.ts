import express from 'express';
const router = express.Router();
import User from '../models/User';
import jwt from 'jsonwebtoken';
// ログイン維持
router.get('/getUser', (req: any, res: any) => {
  try {
    if (req.user && req.user._doc) {
      const { password, googleId, method, email, isAdmin, ...other } =
        req.user._doc;

      return res.status(200).send(other);
    } else if (req.user === undefined) {
      return res.status(401).json(null);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// verifyをtrue
router.post('/activate', async (req: any, res: any) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);

    const check: any = await User.findById(user.id);
    if (check.verified == true) {
      return res
        .status(400)
        .json({ message: 'this email is already activated' });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: 'Account has beeen activated successfully.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ユーザー情報の取得
router.get('/:id', async (req, res) => {
  try {
    const user: any = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;

    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// フォローのユーザー情報
router.get('/followings/:username', async (req, res) => {
  try {
    const currentUser: any = await User.findById(req.params.username);
    const followingUsers = await Promise.all(
      currentUser.followings.map((followingrId) => {
        return User.find({ _id: followingrId });
      }),
    );

    return res.status(200).json(followingUsers);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// フォロワーのユーザー情報
router.get('/followers/:username', async (req, res) => {
  try {
    const currentUser: any = await User.findById(req.params.username);
    const followUsers = await Promise.all(
      currentUser.followers.map((followerId) => {
        return User.find({ _id: followerId });
      }),
    );

    return res.status(200).json(followUsers);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// ユーザー更新
router.put('/:id', async (req, res) => {
  // let newInfo = await User.findById(req.body.userId);
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      const newInfo = await User.findById(req.body.userId);
      return res.status(200).json(newInfo);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json('あなたは自分のアカウントの情報だけ更新できます');
  }
});

// ユーザー情報の取得
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user: any = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, googleId, method, email, isAdmin, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// router.get('/followings', async (req, res) => {
//   const userId = req.query.userId;
//   try {
//     const user = userId
//       ? await User.findById(userId)
//       : await User.findOne({ username: username });
//     const { password, updatedAt, ...other } = user._doc;
//     console.log('アクセス');
//     return res.status(200).json(other);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// フォロー
router.put('/:id/follow', async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user: any = await User.findById(req.params.id);
      const currentUser: any = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });

        const updatedLoginUser: any = await User.findById(req.body.userId);
        const { password, googleId, method, email, isAdmin, ...other } =
          updatedLoginUser._doc;
        return res.status(200).json(other);
      } else {
        return res.status(403).json('既にフォローしてます');
      }
    } else {
      return res.status(500).json('自分をフォローできない');
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// フォロー解除
router.put('/:id/unfollow', async (req: any, res: any) => {
  try {
    const user: any = await User.findById(req.params.id);
    const currentUser: any = await User.findById(req.body.userId);
    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({
        $pull: { followers: req.body.userId },
      });
      await currentUser.updateOne({
        $pull: { followings: req.params.id },
      });
      const updatedLoginUser: any = await User.findById(req.body.userId);
      const { password, googleId, method, email, isAdmin, ...other } =
        updatedLoginUser._doc;

      return res.status(200).json(other);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
