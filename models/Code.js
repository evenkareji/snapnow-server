import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      reuqired: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false },
);

const Code = mongoose.model('Code', codeSchema);
export default Code;
