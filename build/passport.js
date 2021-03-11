"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _passport = _interopRequireDefault(require("passport"));

var _passportKakao = _interopRequireDefault(require("passport-kakao"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _userController = require("./controllers/userController");

var _User = _interopRequireDefault(require("./models/User"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

_passport["default"].use(_User["default"].createStrategy());

_passport["default"].use(new _passportGithub["default"]({
  clientID: process.env.GH_ID,
  clientSecret: process.env.GH_SECRET,
  redirect_url: "http://localhost:4000".concat(_routes["default"].githubCallback)
}, _userController.githubLoginCallback));

_passport["default"].use(new _passportKakao["default"]({
  clientID: process.env.KA_ID,
  clientSecret: "",
  callbackURL: "http://localhost:4000".concat(_routes["default"].kakaoCallback)
}, _userController.kakaoLoginCallback));

_passport["default"].serializeUser(function (user, done) {
  done(null, user);
});

_passport["default"].deserializeUser(function (id, done) {
  _User["default"].findById(id, function (err, user) {
    done(null, user);
  });
});