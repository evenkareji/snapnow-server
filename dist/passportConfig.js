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
import bcrypt from 'bcrypt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User.js';
function passportConfig(passport) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
                scope: ['email', 'profile'],
            }, function (accessToken, refreshToken, profile, done) {
                return __awaiter(this, void 0, void 0, function () {
                    var user, newUser, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 6, , 7]);
                                return [4 /*yield*/, User.findOne({
                                        googleId: profile.id,
                                    })];
                            case 1:
                                user = _a.sent();
                                if (!user) return [3 /*break*/, 2];
                                // 既存のユーザーならそのまま進める
                                done(null, user);
                                return [3 /*break*/, 5];
                            case 2: return [4 /*yield*/, new User({
                                    username: profile.displayName,
                                    email: profile.emails[0].value,
                                    profileImg: profile.photos[0].value,
                                    googleId: profile.id,
                                    method: 'google',
                                })];
                            case 3:
                                newUser = _a.sent();
                                return [4 /*yield*/, newUser.save()];
                            case 4:
                                _a.sent(); // MongoDBに保存
                                done(null, newUser); // 新しいユーザー情報をdoneに渡す
                                _a.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                error_1 = _a.sent();
                                console.error('Error:', error_1);
                                done(error_1);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                });
            }));
            passport.use(new LocalStrategy(
            /**以下がないと動かない */
            {
                usernameField: 'email',
                passwordField: 'password',
            }, function (email, password, done) { return __awaiter(_this, void 0, void 0, function () {
                var user_1, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, User.findOne({ email: email })];
                        case 1:
                            user_1 = _a.sent();
                            if (!user_1)
                                return [2 /*return*/, done(null, false)];
                            bcrypt.compare(password, user_1.password, function (err, result) {
                                if (err)
                                    throw err;
                                if (result === true) {
                                    return done(null, user_1);
                                }
                                else {
                                    return done(null, false);
                                }
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.log(err_1);
                            done(err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }));
            passport.serializeUser(function (user, cb) {
                cb(null, user.id);
            });
            // セッションにあるuser.idを用いてuser情報を取得
            passport.deserializeUser(function (id, cb) { return __awaiter(_this, void 0, void 0, function () {
                var user, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, User.findOne({ _id: id })];
                        case 1:
                            user = _a.sent();
                            cb(null, user);
                            return [3 /*break*/, 3];
                        case 2:
                            err_2 = _a.sent();
                            console.log(err_2);
                            cb(err_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
export default passportConfig;
//# sourceMappingURL=passportConfig.js.map