var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import User from '../models/User.js';
import Code from '../models/Code.js';
import { sendResetCode, sendVerificationEmail } from '../helpers/mailer.js';
import { generateCode } from '../helpers/generateCode.js';
import { generateToken } from '../helpers/tokens.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
var router = express.Router();
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (err)
            throw err;
        if (!user)
            res.status(401).json(null);
        else {
            if (req.logIn) {
                req.logIn(user, function (err) {
                    if (err)
                        throw err;
                    var _a = user._doc, password = _a.password, googleId = _a.googleId, method = _a.method, email = _a.email, isAdmin = _a.isAdmin, other = __rest(_a, ["password", "googleId", "method", "email", "isAdmin"]);
                    var token = generateToken({ id: user._id.toString() }, '7d');
                    res.status(200).json(__assign(__assign({}, other), { token: token }));
                });
            }
        }
    })(req, res, next);
});
router.get('/login/success', function (req, res) {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: 'successfull',
            user: req.user,
        });
    }
});
router.get('/login/failed', function (req, res) {
    res.status(401).json({
        success: false,
        message: 'failure',
    });
});
router.get('/logout', function (req, res, next) {
    try {
        if (req.logout) {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).json(null);
            });
        }
        else {
            // ここに、logoutメソッドが存在しない場合の処理を書くことができます
            res.status(500).send('Logout function not available');
        }
    }
    catch (err) {
        console.log(err);
    }
});
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login/failed',
}));
// ユーザー登録
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var salt, hashedPassword, newUser_1, emailVerificationToken, url, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                salt = 10;
                return [4 /*yield*/, bcrypt.hash(req.body.password, salt)];
            case 1:
                hashedPassword = _a.sent();
                newUser_1 = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    method: ['local'],
                });
                return [4 /*yield*/, newUser_1.save()];
            case 2:
                newUser_1 = _a.sent();
                emailVerificationToken = generateToken({ id: newUser_1._id.toString() }, '30m');
                url = "".concat(process.env.CLIENT_URL, "/activate/").concat(emailVerificationToken);
                sendVerificationEmail(newUser_1.email, newUser_1.username, url);
                // Passport.js の req.logIn を使ってログイン処理を行う
                req.logIn(newUser_1, function (err) {
                    if (err) {
                        throw err;
                    }
                    var _a = newUser_1._doc, password = _a.password, googleId = _a.googleId, method = _a.method, email = _a.email, isAdmin = _a.isAdmin, other = __rest(_a, ["password", "googleId", "method", "email", "isAdmin"]);
                    var token = generateToken({ id: newUser_1._id.toString() }, '7d');
                    res.status(200).json(__assign(__assign({}, other), { token: token }));
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.status(500).json(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// なくていいかもしれないところ
router.post('/findUser', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                return [4 /*yield*/, User.findOne({ email: email }).select('-password')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: 'Account does not exist' })];
                }
                return [2 /*return*/, res.status(200).json({ email: user.email })];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Codeを発行する
router.post('/sendResetPasswordCode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, code, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = req.body.email;
                return [4 /*yield*/, User.findOne({ email: email }).select('-password')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: '一致するユーザーは見つかりませんでした' })];
                }
                return [4 /*yield*/, Code.findOneAndRemove({ user: user._id })];
            case 2:
                _a.sent();
                code = generateCode(5);
                return [4 /*yield*/, new Code({
                        code: code,
                        user: user.id,
                    }).save()];
            case 3:
                _a.sent();
                sendResetCode(user.email, user.username, code);
                return [2 /*return*/, res.status(200).json({
                        message: 'Email reset code has been sent to your email',
                    })];
            case 4:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/validateResetCode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, code, user, Dbcode, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, code = _a.code;
                return [4 /*yield*/, User.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: 'ユーザーが存在しません' })];
                }
                return [4 /*yield*/, Code.findOne({ user: user._id })];
            case 2:
                Dbcode = _b.sent();
                if (!Dbcode) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: '認証コードが発行されていません' })];
                }
                if (Dbcode.code !== code) {
                    return [2 /*return*/, res.status(400).json({ message: '認証コードは間違っています' })];
                }
                return [2 /*return*/, res.status(200).json({ message: '認証コードが一致しました' })];
            case 3:
                error_3 = _b.sent();
                console.log(error_3);
                res.status(400).json({ message: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/changePassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, salt, hashedPassword;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                salt = 10;
                return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 1:
                hashedPassword = _b.sent();
                return [4 /*yield*/, User.findOneAndUpdate({ email: email }, { password: hashedPassword })];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'パスワードを更新しました' })];
        }
    });
}); });
// ユーザー更新
// router.put('/register', async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { email: req.body.email },
//       {
//         $set: req.body,
//       },
//     );
//     return res.status(200).json(user);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });
// ログイン
// router.post('/login', (req: any, res, next) => {
//   passport.authenticate('local', (err, user) => {
//     console.log(req.body);
//     if (err) throw err;
//     console.log('認証前');
//     if (!user) {
//       res.send('No User Exist');
//     } else {
//       req.logIn(user, (err) => {
//         if (err) throw err;
//         console.log('認証成功');
//         return res.send('認証成功');
//       });
//     }
//   })(req, res, next);
// });
export default router;
//# sourceMappingURL=auth.js.map