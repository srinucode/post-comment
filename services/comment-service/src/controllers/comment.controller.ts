import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as commentService from "../services/commentService";
import { deleteCommentsByPostId } from "../services/commentService";

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *               - text
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *               text:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *             example:
 *               postId: "66fb23c9a4d95c2c8b9a10e1"
 *               userId: "66fb240da4d95c2c8b9a10f0"
 *               text: "This is a comment"
 *               parentId: null
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 */
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    const { parentId, text } = req.body;
    
    req.user = req.user || { id: "123" }; // fallback user
    console.log(req.user?.id);
    const comment = await commentService.createComment(req.body.postId, req.user!.id, parentId, text);
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error creating comment" });
  }
};

/**
 * @swagger
 * /comments/parent/{parentId}:
 *   get:
 *     summary: Get all comments for a given parent (post or comment)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the parent (postId or commentId)
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 */
export const getCommentsByParent = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    const comments = await commentService.getCommentsByParent(parentId);
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error fetching comments" });
  }
};



/**
 * @swagger
 * /comments/post/{postId}/parent/{parentId}:
 *   get:
 *     summary: Get all comments for a given postId and parentId
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parent (post or comment)
 *     responses:
 *       200:
 *         description: List of comments for the given postId and parentId
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 */
export const getCommentsByPostAndParent = async (req: Request, res: Response) => {
  try {
    const { postId, parentId } = req.params;
    const comments = await commentService.getCommentsByPostAndParent(postId, parentId);
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error fetching comments" });
  }
};

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *             example:
 *               text: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comment not found
 */
export const editComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updatedComment = await commentService.updateComment(id, text);

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error updating comment" });
  }
};



/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Delete Comment Request Params:", req.params);
    const { id } = req.params;
    const deleted = await commentService.deleteComment(id);

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully", deleted });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error deleting comment" });
  }
};

/**
 * @swagger
 * /comments/deleteByPost/{postId}:
 *   delete:
 *     summary: Delete all comments for a given postId
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Successfully deleted comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/DeleteResult'
 *       404:
 *         description: No comments found for the given postId
 *       500:
 *         description: Internal server error
 */
export const deleteCommentsForPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const result = await deleteCommentsByPostId(postId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No comments found for this postId" });
    }

    res.status(200).json({
      message: `Deleted ${result.deletedCount} comments for postId ${postId}`,
      result,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting comments", error: error.message });
  }
};
