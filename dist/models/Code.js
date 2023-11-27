import mongoose from 'mongoose';
var ObjectId = mongoose.Schema.ObjectId;
var codeSchema = new mongoose.Schema({
    code: {
        type: Number,
        reuqired: true,
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
}, { versionKey: false });
var Code = mongoose.model('Code', codeSchema);
export default Code;
//# sourceMappingURL=Code.js.map