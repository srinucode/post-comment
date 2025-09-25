import { Router } from "express";
import {
    createComment, 
    deleteComment, 
    deleteCommentsForPost, 
    getCommentsByParent, 
    getCommentsByPostAndParent, 
    editComment
} from "../controllers/comment.controller";


const router = Router();

// POST /comments
router.post("/", createComment);

// GET /comments/parent/:parentId
router.get("/parent/:parentId", getCommentsByParent);


// GET /comments/post/:postId/parent/:parentId
router.get("/post/:postId/parent/:parentId", getCommentsByPostAndParent);


// DELETE /comments/:id
router.delete("/:id", deleteComment);

// DELETE /comments/deleteByPost/:postId
router.delete("/deleteByPost/:postId", deleteCommentsForPost);

// PUT /comments/:id
router.put("/:id", editComment);


    
export default router;