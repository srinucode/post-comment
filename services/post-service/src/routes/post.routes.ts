import { Router } from "express";
import { createPost, deletePostById, getPosts, deletePostsByUser, getPostsByUser, getPostsByIds } from "../controllers/post.controller";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.post("/create", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.delete("/:id", authMiddleware, deletePostById);
router.delete("/user/:userId", authMiddleware, deletePostsByUser);

router.post("/batch", authMiddleware, getPostsByIds);   // New
router.get("/user/:userId", authMiddleware, getPostsByUser); // New

export default router;
