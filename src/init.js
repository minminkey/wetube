import "./db";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

import "./models/Comment";
import "./models/User";
import "./models/Video";

const PORT = 4000;

const handleListening = () =>
  console.log(`Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
