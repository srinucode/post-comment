import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface for strong typing
export interface IComment {
  parentId: string;   // can be a postId or another commentId
  postId: string; // added postId field
  userId: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Combine with Mongoose Document for full typing
export interface ICommentDocument extends IComment, Document {}

// Schema definition
const commentSchema = new Schema<ICommentDocument>(
  {
    postId: { type: String, required: true }, 
    parentId: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

// Mongoose model
const Comment = mongoose.model<ICommentDocument>("Comment", commentSchema);

export default Comment;
