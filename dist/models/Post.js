import mongoose from 'mongoose';
var Schema = mongoose.Schema, Mixed = mongoose.Schema.Types.Mixed;
var postSchema = new Schema({
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
}, { timestamps: true }, { versionKey: false });
var Post = mongoose.model('Post', postSchema);
export default Post;
//# sourceMappingURL=Post.js.map