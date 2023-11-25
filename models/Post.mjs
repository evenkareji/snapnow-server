import mongoose from 'mongoose';
const {
  Schema,
  Schema: {
    Types: { Mixed },
  },
} = mongoose;

const postSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    img: {
      type: Mixed, // ここでMixed型を使用
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
  { versionKey: false },
);

const Post = mongoose.model('Post', postSchema);
export default Post;
