import passport from "passport";
import request from "request";
import undefsafe from "undefsafe";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords don't match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check Email or Password",
});

export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check Email or Password",
});

export const githubLoginCallback = async (accessToken, _, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name },
  } = profile;

  const emails = undefsafe(profile, "emails.0.value");
  let promise = null;

  if (emails) {
    promise = Promise.resolve(emails);
  } else {
    promise = new Promise((resolve, reject) => {
      request(
        {
          url: "https://api.github.com/user",
          json: true,
          headers: {
            "user-agent": "my user-agent",
            authorization: `token ${accessToken}`,
          },
        },
        (error, res, body) => {
          if (error) {
            return reject(error);
          }
          resolve(body.find((entry) => entry.primary).emails);
          return body;
        }
      );
    });
  }
  promise.then(async (email) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        user.githubId = id;
        user.save();
        return cb(null, user);
      }
      const newUser = await User.create({
        email,
        name,
        githbId: id,
        avatarUrl,
      });
      return cb(null, newUser);
    } catch (error) {
      return cb(error);
    }
  });
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate("kakao", {
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check Email or Password",
});

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    id,
    username: name,
    _json: {
      properties: { profile_image: profileImg },
      kakao_account: { email },
    },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.kakaoId = id;
      user.avatarUrl = profileImg;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      kakaoId: id,
      avatarUrl: profileImg,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postKakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash("info", "Logged Out. See you later");
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    console.log(req.user.id);
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User Not Found");
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash("success", "Profile Updated");
    res.redirect(routes.me);
  } catch (error) {
    // console.log(error);
    req.flash("error", "Can't Update Profile");
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Passwords don't match");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't Change Password");
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
