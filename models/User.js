import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 1,
      max: 15,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      min: 6,
      max: 50,
    },
    googleId: {
      type: String,
      required: false,
    },
    method: {
      type: [
        {
          type: String,
          enum: ['local', 'google'],
        },
      ],
      required: true,
    },
    profileImg: {
      type: String,
      trim: true,
      default:
        'https://res.cloudinary.com/dvfk0f89h/image/upload/v1700120425/asdfad/post%20Image/okmrxwkl2cithbeg0had.png',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 10,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { versionKey: false },
);

export default mongoose.model('User', UserSchema);
