import dotenv from "dotenv";

import passport from "passport";
import KakaoStrategy from "passport-kakao";
import GithubStrategy from "passport-github";
import {
  githubLoginCallback,
  kakaoLoginCallback,
} from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

dotenv.config();
passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      redirect_url: `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KA_ID,
      clientSecret: "",
      callbackURL: `http://localhost:4000${routes.kakaoCallback}`,
    },
    kakaoLoginCallback
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});
