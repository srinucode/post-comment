import { Request, Response } from "express";
import { posts } from "../models/post.model";
import { getChannel } from "../messaging/rabbit";

export const createPost = async (req: Request, res: Response) => {
  const { userId, content } = req.body;
  const newPost = { id: posts.length + 1, userId, content, createdAt: new Date() };
  posts.push(newPost);

  // Publish event to RabbitMQ
  const channel = getChannel();
  if (channel) {
    await channel.assertExchange("post_events", "fanout", { durable: false });
    channel.publish("post_events", "", Buffer.from(JSON.stringify(newPost)));
    console.log("📩 Post event published:", newPost);
  }

  res.status(201).json(newPost);
};

export const getPosts = (req: Request, res: Response) => {
  res.json(posts);
}
