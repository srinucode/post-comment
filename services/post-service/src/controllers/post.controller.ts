import { Request, Response } from "express";
import { posts } from "../models/post.model";
import { getChannel } from "../messaging/rabbit";
import { AuthRequest } from "../middleware/authMiddleware";
import * as postService from "../services/postService";

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "This is my first post"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post created successfully"
 *                 postId:
 *                   type: string
 *                   example: "650f0b7f1a2d3a1c12345678"
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    console.log("create post route");
    const { text } = req.body;
    console.log(text);
    const post = await postService.createPost(req.user!.id, text);

    // Publish event to RabbitMQ
    const channel = getChannel();
    if (channel) {
      await channel.assertExchange("post_events", "fanout", { durable: false });
      channel.publish("post_events", "", Buffer.from(JSON.stringify(post)));
      console.log("📩 Post event published:", post);
    }

    res.status(201).json({
      message: "Post created successfully",
      postId: post._id,
      post,
    });
  } catch (error: any) {
    console.log("Error in createPost controller:");
    console.log(error);
    res.status(400).json({ message: error.message || "Error creating post" });
  }
};


/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Get all posts by a user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of posts by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       404:
 *         description: No posts found for this user
 *       400:
 *         description: Error fetching posts
 */
export const getPostsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    console.log("Fetching posts for user ID:", userId);
    const posts = await postService.getPostsByUser(userId);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.json({ posts });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error fetching posts" });
  }
};


/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
export const deletePostById = async (req: AuthRequest, res: Response) => {
  try {

    const postId = req.params.id;
    console.log("Post ID to delete:", postId);
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    console.log(req.params);
    console.log("Request to delete post with ID:", postId);
    const deletedPost = await postService.deletePostById(postId);

    // Publish event to RabbitMQ
    const channel = getChannel();
    if (channel) {
      await channel.assertExchange("post_events", "fanout", { durable: false });
      const event = {
        action: "DELETE_SINGLE",
        postId: postId,
        userId: req.user!.id,
        deletedAt: new Date(),
        event: "POST_DELETED"
      };
      channel.publish("post_events", "", Buffer.from(JSON.stringify(event)));
      console.log("📩 Post delete event published:", event);
    }

    res.json({ message: "Post deleted successfully", postId: postId });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error deleting post" });
  }
};



/**
 * @swagger
 * /posts/user/{userId}:
 *   delete:
 *     summary: Delete all posts by a user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose posts should be deleted
 *     responses:
 *       200:
 *         description: All posts by the user deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All posts by user deleted successfully"
 *                 deletedCount:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
export const deletePostsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const deletedPosts = await postService.deletePostsByUserId(userId);

    // Publish each deleted post as an event
    const channel = getChannel();
    if (channel && deletedPosts.length > 0) {
      await channel.assertExchange("post_events", "fanout", { durable: false });

      deletedPosts.forEach((post) => {
        const event = {
          action: "DELETE_ALL_BY_USER",
          postId: post._id,
          userId: post.userId,
          deletedAt: new Date(),
          event: "POST_DELETED"
        };
        channel.publish("post_events", "", Buffer.from(JSON.stringify(event)));
        console.log("📩 Post delete event published:", event);
      });
    }

    res.json({
      message: "All posts by user deleted successfully",
      deletedCount: deletedPosts.length,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error deleting posts" });
  }
};
