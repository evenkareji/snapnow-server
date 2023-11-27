var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from 'express';
var router = express.Router();
import Post from '../models/Post.js';
import User from '../models/User.js';
// 投稿
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newPost, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, new Post(req.body)];
            case 1:
                newPost = _a.sent();
                return [4 /*yield*/, newPost.save()];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 自分の全ての投稿
router.get('/profile/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, posts, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User.findOne({ username: req.params.username })];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, Post.find({ userId: user._id })];
            case 2:
                posts = _a.sent();
                return [2 /*return*/, res.status(200).json(posts)];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 全投稿
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Post.find()];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// 投稿編集api
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Post.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!(post.userId === req.body.userId)) return [3 /*break*/, 3];
                return [4 /*yield*/, post.updateOne({
                        $set: req.body,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json('投稿編集に成功しました')];
            case 3: return [2 /*return*/, res.status(200).json('あなたは他人の投稿に編集できません')];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_4 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_4)];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 投稿削除api
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Post.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!(post.userId === req.body.userId)) return [3 /*break*/, 3];
                return [4 /*yield*/, post.deleteOne()];
            case 2:
                _a.sent();
                res.status(200).json('投稿を削除しました');
                return [3 /*break*/, 4];
            case 3:
                res.status(403).json('投稿を削除できません');
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                res.status(403).json(err_5);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// 自分投稿取得
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Post.findById(req.params.id)];
            case 1:
                post = _a.sent();
                return [2 /*return*/, res.status(200).json(post)];
            case 2:
                err_6 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_6)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// いいねを押す
router.put('/:id/like', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isLike, post, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                isLike = false;
                return [4 /*yield*/, Post.findById(req.params.id)];
            case 1:
                post = _a.sent();
                if (!!post.likes.includes(req.body.userId)) return [3 /*break*/, 3];
                return [4 /*yield*/, post.updateOne({
                        $push: { likes: req.body.userId },
                    })];
            case 2:
                _a.sent();
                isLike = true;
                return [2 /*return*/, res.status(200).json(isLike)];
            case 3: return [4 /*yield*/, post.updateOne({
                    $pull: {
                        likes: req.body.userId,
                    },
                })];
            case 4:
                _a.sent();
                isLike = false;
                return [2 /*return*/, res.status(200).json(isLike)];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_7 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_7)];
            case 7: return [2 /*return*/];
        }
    });
}); });
export default router;
//# sourceMappingURL=post.js.map