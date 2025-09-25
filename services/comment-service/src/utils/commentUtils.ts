import Comment, { IComment } from "../models/comment.model";
import mongoose from "mongoose";

/**
 * Recursively deletes a comment and all its child comments.
 * Returns all deleted comments in a flat array.
 */
export const deleteCommentRecursively = async (
  commentId: string
): Promise<IComment[]> => {
  // Optional: skip invalid IDs instead of throwing
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return [];
  }

  const deletedComments: IComment[] = [];

  const recursiveDelete = async (id: string) => {
    // Delete current comment
    console.log(`Deleting comment with ID: ${id}`);
    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) return;

    deletedComments.push(deleted);

    // Find children and cast to ensure _id is available
    const children = (await Comment.find({ parentId: id })) as (IComment & { _id: mongoose.Types.ObjectId })[];

    // Recursively delete children
    for (const child of children) {
      await recursiveDelete(child._id.toString());
    }
  };

  await recursiveDelete(commentId);

  return deletedComments;
};
