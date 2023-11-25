import bcrypt from 'bcrypt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User';

async function passportConfig(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile'],
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          // 既存のユーザーかどうか確認
          let user = await User.findOne({
            googleId: profile.id,
          });

          if (user) {
            // 既存のユーザーならそのまま進める
            done(null, user);
          } else {
            let newUser = await new User({
              username: profile.displayName,
              email: profile!.emails[0].value,
              profileImg: profile.photos[0].value,
              googleId: profile.id,
              method: 'google',
            });

            await newUser.save(); // MongoDBに保存
            done(null, newUser); // 新しいユーザー情報をdoneに渡す
          }
        } catch (error) {
          console.error('Error:', error);
          done(error);
        }
      },
    ),
  );
  passport.use(
    new LocalStrategy(
      /**以下がないと動かない */
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        } catch (err) {
          console.log(err);
          done(err);
        }
      },
    ),
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  // セッションにあるuser.idを用いてuser情報を取得
  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await User.findOne({ _id: id });

      cb(null, user);
    } catch (err) {
      console.log(err);
      cb(err);
    }
  });
}
export default passportConfig;
