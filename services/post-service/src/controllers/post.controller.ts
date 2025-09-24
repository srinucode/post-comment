import { Request, Response } from "express";
import { posts } from "../models/post.model";
import { getChannel } from "../messaging/rabbit";
import { AuthRequest } from "../middleware/authMiddleware";
import * as postService from "../services/postService";

/**
 * @swagger
 * /post/create:
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
 * /post/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
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
 * /post/user/{userId}:
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
 *         description: All posts by user deleted successfully
 *       401:
 *         description: Unauthorized
 */
export const deletePostsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await postService.deletePostsByUserId(userId);
    res.json({ message: "All posts by user deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error deleting posts" });
  }
};





// export const createPost = async (req: AuthRequest, res: Response) => {
//   console.log("create post route");
//   // const { userId, content } = req.body;
//   // const newPost = { id: posts.length + 1, userId, content, createdAt: new Date() };
//   // posts.push(newPost);

//   // // Publish event to RabbitMQ
//   // const channel = getChannel();
//   // if (channel) {
//   //   await channel.assertExchange("post_events", "fanout", { durable: false });
//   //   channel.publish("post_events", "", Buffer.from(JSON.stringify(newPost)));
//   //   console.log("📩 Post event published:", newPost);
//   // }

//   // res.status(201).json(newPost);
//   return res.status(201).json({ message: "Post created (mock)" });
// };

export const getPosts = (req: Request, res: Response) => {
  res.json(posts);
}


/**
 * @swagger
 * /post/batch:
 *   post:
 *     summary: Get multiple posts by IDs
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
 *               - postIds
 *             properties:
 *               postIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["650f0b7f1a2d3a1c12345678", "650f0b7f1a2d3a1c87654321"]
 *     responses:
 *       200:
 *         description: List of posts
 *       400:
 *         description: Bad request
 */
export const getPostsByIds = async (req: AuthRequest, res: Response) => {
  try {
    const { postIds } = req.body;
    if (!postIds || !Array.isArray(postIds)) {
      return res.status(400).json({ message: "postIds must be an array" });
    }

    const posts = await postService.getPostsByIds(postIds);
    res.json({ posts });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error fetching posts" });
  }
};

/**
 * @swagger
 * /post/user/{userId}:
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
 *       404:
 *         description: No posts found for this user
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


