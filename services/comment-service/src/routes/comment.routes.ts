import { Router } from "express";
import { createComment, getCommentsByPost } from "../controllers/comment.controller";

const router = Router();

router.post("/", createComment);
router.get("/:postId", getCommentsByPost);

export default router;
