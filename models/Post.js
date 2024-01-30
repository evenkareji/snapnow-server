import mongoose from 'mongoose';
const {
  Schema,
  Schema: {
    Types: { Mixed },
  },
} = mongoose;
const { ObjectId } = mongoose.Schema;

const postSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      text: true,
      max: 50,
    },
    img: {
      type: Mixed,
    },
    audioUrl: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    search: [
      {
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

const Post = mongoose.model('Post', postSchema);
export default Post;
