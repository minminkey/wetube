import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  logout,
  postLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin, postLogin);

globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.home, home);

globalRouter.get(routes.logout, logout);
globalRouter.get(routes.search, search);

export default globalRouter;
