"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

_mongoose["default"].connect( // "mongodb://localhost:27017/we-tube",
// process.env.MONGO_URL,
process.env.MONGO_URL_PROD, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

var db = _mongoose["default"].connection;

var handleOpen = function handleOpen() {
  return console.log(" Connected to DB");
};

var handleError = function handleError(error) {
  return console.log("Error on DB connection:".concat(error));
};

db.once("open", handleOpen);
db.on("error", handleError);