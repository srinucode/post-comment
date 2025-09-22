import { Request, Response } from "express";
import { comments } from "../models/comment.model";
import { postsCache } from "../models/postCache";

export const createComment = (req: Request, res: Response) => {
  const { postId, userId, text } = req.body;

  const postExists = postsCache.find(p => p.id === postId);
  if (!postExists) {
    return res.status(400).json({ error: "Post does not exist" });
  }

  const newComment = { id: comments.length + 1, postId, userId, text, createdAt: new Date() };
  comments.push(newComment);

  res.status(201).json(newComment);
};


export const getCommentsByPost = (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const postComments = comments.filter(c => c.postId === postId);
  res.json(postComments);
};
