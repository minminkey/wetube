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
});

export const githubLogin = passport.authenticate("github");

// export const githubLoginCallback = async (accessToken, _, profile, cb) => {
//   const {
//     _json: { id, avatar_url, name },
//   } = profile;
//   const email = undefsafe(profile, "emails.0.value");
//   let promise = null;
//   if (email) {
//     promise = Promise.resolve(email);
//   } else {
//     promise = new Promise((resolve, reject) => {
//       request(
//         {
//           url: "https://api.github.com/user/emails",
//           json: true,
//           headers: {
//             "user-agent": "my user-agent",
//             authorization: `token ${accessToken}`,
//           },
//         },
//         (error, res, body) => {
//           if (error) {
//             return reject(error);
//           }
//           resolve(body.find((entry) => entry.primary).email);
//         }
//       );
//     });
//   }
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
          console.log(body);
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

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

export const userDetail = (req, res) =>
  res.render("userDetail", { pageTitle: "User Detail" });
export const editProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
export const changePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });
