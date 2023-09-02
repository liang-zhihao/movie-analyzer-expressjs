import express from "express";
import CommentsController from "../controllers/CommentsController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/", auth(true, false), CommentsController.addComment);
router.put("/like", auth(true, false), CommentsController.likeOrDislikeComment);
router.delete(
  "/:commentId",
  auth(true, false),
  CommentsController.deleteComment
);
router.put("/:commentId", auth(true, false), CommentsController.updateComment);

export default router;
