import express from "express";
import routes from "../routes";
import {
  deleteComment,
  postAddComment,
  postRegisterView,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, deleteComment);

export default apiRouter;
