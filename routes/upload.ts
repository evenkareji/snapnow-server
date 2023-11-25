import express, { Request as ExpressRequest, Response, Router } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router: Router = express.Router();

// 画像の保存先のpathがうまく定められていないからデプロイ後に画像が使えない
const profileStorage: StorageEngine = multer.diskStorage({
  destination: (
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, path.resolve(__dirname, '../public/assets/person'));
  },
  filename: (
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, file.originalname);
  },
});

const imageStorage: StorageEngine = multer.diskStorage({
  destination: (
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, path.resolve(__dirname, '../public/assets/images'));
  },
  filename: (
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, file.originalname);
  },
});

const profileUpload = multer({ storage: profileStorage });
router.post(
  '/profile-image',
  profileUpload.single('profile_image'),
  (req: ExpressRequest, res: Response) => {
    try {
      console.log('profle画像成功');
      return res.status(200).json('アップロード成功しました');
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
);

const imageUpload = multer({ storage: imageStorage });
router.post(
  '/post-image',
  imageUpload.single('file'),
  (req: ExpressRequest, res: Response) => {
    try {
      console.log('画像投稿成功');
      return res.status(200).json('アップロード成功しました');
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
);

// cloudinary
router.post('/uploadImages', async (req: any, res: any) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files selected' });
    }

    const file = req.files.file;

    // ファイル形式のチェック
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/gif' &&
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/webp'
    ) {
      removeTmp(file.tempFilePath);
      return res
        .status(400)
        .json({ message: 'この画像形式はサポートされていません' });
    }

    // ファイルサイズのチェック
    if (file.size > 1024 * 1024 * 5) {
      removeTmp(file.tempFilePath);
      return res
        .status(400)
        .json({ message: 'ファイルのサイズが大きすぎます' });
    }

    // 画像をアップロード
    const url = await uploadToCloudinary(file, req.body.path);
    res.json({ url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/uploadProfileImage', async (req: any, res: any) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files selected' });
    }

    // ユーザーIDのチェック（例）
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const file = req.files.file;

    // ファイル形式とサイズのチェック...

    // 画像をアップロード
    const url = await uploadToCloudinary(file, `profile/${userId}`);

    // データベースにプロフィール画像URLを保存する処理をここに追加

    res.json({ url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.tempFilePath,
      {
        folder: path,
      },
      (err, res: any) => {
        if (err) {
          removeTmp(file.tempFilePath);
          console.error('Upload image failed:', err);
          reject('画像アップロードに失敗しました');
        } else {
          resolve({
            url: res.secure_url,
          });
        }
      },
    );
  });
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
export default router;
