import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(
  // "mongodb://localhost:27017/we-tube",
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;

const handleOpen = () => console.log(" Connected to DB");
const handleError = error => console.log(`Error on DB connection:${error}`);

db.once("open", handleOpen);
db.on("error", handleError);