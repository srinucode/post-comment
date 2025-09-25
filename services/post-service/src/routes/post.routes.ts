import { Router } from "express";
import { 
    createPost, 
    deletePostById, 
    deletePostsByUser, 
    getPostsByUser
} from "../controllers/post.controller";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();


// POST /posts
router.post("/", authMiddleware, createPost);
// GET /posts/user/:userId
router.get("/user/:userId", authMiddleware, getPostsByUser);
// DELETE /posts/:id
router.delete("/:id", authMiddleware, deletePostById);
// DELETE /posts/user/:userId
router.delete("/user/:userId", authMiddleware, deletePostsByUser);
export default router;
