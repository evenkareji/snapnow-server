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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import express from 'express';
var router = express.Router();
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
// ログイン維持
router.get('/getUser', function (req, res) {
    try {
        if (req.user && req.user._doc) {
            var _a = req.user._doc, password = _a.password, googleId = _a.googleId, method = _a.method, email = _a.email, isAdmin = _a.isAdmin, other = __rest(_a, ["password", "googleId", "method", "email", "isAdmin"]);
            return res.status(200).send(other);
        }
        else if (req.user === undefined) {
            return res.status(401).json(null);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});
// verifyをtrue
router.post('/activate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, check, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                token = req.body.token;
                user = jwt.verify(token, process.env.TOKEN_SECRET);
                return [4 /*yield*/, User.findById(user.id)];
            case 1:
                check = _a.sent();
                if (!(check.verified == true)) return [3 /*break*/, 2];
                return [2 /*return*/, res
                        .status(400)
                        .json({ message: 'this email is already activated' })];
            case 2: return [4 /*yield*/, User.findByIdAndUpdate(user.id, { verified: true })];
            case 3:
                _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: 'Account has beeen activated successfully.' })];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                res.status(500).json({ message: error_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// ユーザー情報の取得
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, password, updatedAt, other, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User.findById(req.params.id)];
            case 1:
                user = _b.sent();
                _a = user._doc, password = _a.password, updatedAt = _a.updatedAt, other = __rest(_a, ["password", "updatedAt"]);
                return [2 /*return*/, res.status(200).json(other)];
            case 2:
                err_1 = _b.sent();
                return [2 /*return*/, res.status(500).json(err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); });
// フォローのユーザー情報
router.get('/followings/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, followingUsers, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User.findById(req.params.username)];
            case 1:
                currentUser = _a.sent();
                return [4 /*yield*/, Promise.all(currentUser.followings.map(function (followingrId) {
                        return User.find({ _id: followingrId });
                    }))];
            case 2:
                followingUsers = _a.sent();
                return [2 /*return*/, res.status(200).json(followingUsers)];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// フォロワーのユーザー情報
router.get('/followers/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, followUsers, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User.findById(req.params.username)];
            case 1:
                currentUser = _a.sent();
                return [4 /*yield*/, Promise.all(currentUser.followers.map(function (followerId) {
                        return User.find({ _id: followerId });
                    }))];
            case 2:
                followUsers = _a.sent();
                return [2 /*return*/, res.status(200).json(followUsers)];
            case 3:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_3)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ユーザー更新
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newInfo, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.body.userId === req.params.id)) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, User.findByIdAndUpdate(req.params.id, {
                        $set: req.body,
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, User.findById(req.body.userId)];
            case 3:
                newInfo = _a.sent();
                return [2 /*return*/, res.status(200).json(newInfo)];
            case 4:
                err_4 = _a.sent();
                return [2 /*return*/, res.status(500).json(err_4)];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res
                    .status(403)
                    .json('あなたは自分のアカウントの情報だけ更新できます')];
            case 7: return [2 /*return*/];
        }
    });
}); });
// ユーザー情報の取得
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, username, user, _a, _b, password, googleId, method, email, isAdmin, other, err_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = req.query.userId;
                username = req.query.username;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                if (!userId) return [3 /*break*/, 3];
                return [4 /*yield*/, User.findById(userId)];
            case 2:
                _a = _c.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, User.findOne({ username: username })];
            case 4:
                _a = _c.sent();
                _c.label = 5;
            case 5:
                user = _a;
                _b = user._doc, password = _b.password, googleId = _b.googleId, method = _b.method, email = _b.email, isAdmin = _b.isAdmin, other = __rest(_b, ["password", "googleId", "method", "email", "isAdmin"]);
                return [2 /*return*/, res.status(200).json(other)];
            case 6:
                err_5 = _c.sent();
                return [2 /*return*/, res.status(500).json(err_5)];
            case 7: return [2 /*return*/];
        }
    });
}); });
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
router.put('/:id/follow', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, currentUser, updatedLoginUser, _a, password, googleId, method, email, isAdmin, other, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                if (!(req.body.userId !== req.params.id)) return [3 /*break*/, 8];
                return [4 /*yield*/, User.findById(req.params.id)];
            case 1:
                user = _b.sent();
                return [4 /*yield*/, User.findById(req.body.userId)];
            case 2:
                currentUser = _b.sent();
                if (!!user.followers.includes(req.body.userId)) return [3 /*break*/, 6];
                return [4 /*yield*/, user.updateOne({
                        $push: { followers: req.body.userId },
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, currentUser.updateOne({
                        $push: { followings: req.params.id },
                    })];
            case 4:
                _b.sent();
                return [4 /*yield*/, User.findById(req.body.userId)];
            case 5:
                updatedLoginUser = _b.sent();
                _a = updatedLoginUser._doc, password = _a.password, googleId = _a.googleId, method = _a.method, email = _a.email, isAdmin = _a.isAdmin, other = __rest(_a, ["password", "googleId", "method", "email", "isAdmin"]);
                return [2 /*return*/, res.status(200).json(other)];
            case 6: return [2 /*return*/, res.status(403).json('既にフォローしてます')];
            case 7: return [3 /*break*/, 9];
            case 8: return [2 /*return*/, res.status(500).json('自分をフォローできない')];
            case 9: return [3 /*break*/, 11];
            case 10:
                err_6 = _b.sent();
                return [2 /*return*/, res.status(500).json(err_6)];
            case 11: return [2 /*return*/];
        }
    });
}); });
// フォロー解除
router.put('/:id/unfollow', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, currentUser, updatedLoginUser, _a, password, googleId, method, email, isAdmin, other, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                return [4 /*yield*/, User.findById(req.params.id)];
            case 1:
                user = _b.sent();
                return [4 /*yield*/, User.findById(req.body.userId)];
            case 2:
                currentUser = _b.sent();
                if (!user.followers.includes(req.body.userId)) return [3 /*break*/, 6];
                return [4 /*yield*/, user.updateOne({
                        $pull: { followers: req.body.userId },
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, currentUser.updateOne({
                        $pull: { followings: req.params.id },
                    })];
            case 4:
                _b.sent();
                return [4 /*yield*/, User.findById(req.body.userId)];
            case 5:
                updatedLoginUser = _b.sent();
                _a = updatedLoginUser._doc, password = _a.password, googleId = _a.googleId, method = _a.method, email = _a.email, isAdmin = _a.isAdmin, other = __rest(_a, ["password", "googleId", "method", "email", "isAdmin"]);
                return [2 /*return*/, res.status(200).json(other)];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_7 = _b.sent();
                return [2 /*return*/, res.status(500).json(err_7)];
            case 8: return [2 /*return*/];
        }
    });
}); });
export default router;
//# sourceMappingURL=users.js.map