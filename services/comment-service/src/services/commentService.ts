import Comment, { IComment } from "../models/comment.model";
import { getChannel } from "../messaging/rabbit";
import { deleteCommentRecursively } from "../utils/commentUtils";

/**
 * Create a new comment (can be on a post or another comment)
 */
export const createComment = async (postId: string, userId: string, parentId: string, text: string): Promise<IComment> => {
  if (!text) {
    throw new Error("Text is required");
  }

  const comment = new Comment({ postId, parentId, userId, text });
  await comment.save();

  // Publish event to RabbitMQ
  const channel = getChannel();
  if (channel) {
    await channel.assertExchange("comment_events", "fanout", { durable: false });
    channel.publish("comment_events", "", Buffer.from(JSON.stringify(comment)));
  }

  return comment;
};

/**
 * Get all comments for a given parent (postId or commentId)
 */
export const getCommentsByParent = async (parentId: string): Promise<IComment[]> => {
  return await Comment.find({ parentId });
};

/**
 * Delete a comment by ID (including all child comments recursively)
 * Publishes COMMENT_DELETED events for all deleted comments
 */
export const deleteComment = async (commentId: string): Promise<IComment[] | null> => {
  console.log(`Deleting comment and its children for ID: ${commentId}`);
  console.log(commentId);
  // Use the util function to delete recursively
  const deletedComments = await deleteCommentRecursively(commentId);

  // If deleted, publish events
  if (deletedComments.length > 0) {
    const channel = getChannel();
    if (channel) {
      await channel.assertExchange("comment_events", "fanout", { durable: false });
      deletedComments.forEach((comment) => {
        channel.publish(
          "comment_events",
          "",
          Buffer.from(
            JSON.stringify({
              event: "COMMENT_DELETED",
              data: { commentId: (comment as any)._id, deletedAt: new Date().toISOString() },
            })
          )
        );
      });
    }
    return deletedComments; // return array of deleted comments
  }

  return null; // nothing deleted
};

/**
 * Deletes all comments for a given postId
 */
export const deleteCommentsByPostId = async (postId: string) => {
  const result = await Comment.deleteMany({ postId });
  return result; // contains { acknowledged: true, deletedCount: <number> }
};


/**
 * Get comments for a given postId and parentId
 */
export const getCommentsByPostAndParent = async (
  postId: string,
  parentId: string
): Promise<IComment[]> => {
  return await Comment.find({ postId, parentId });
};


/**
 * Update a comment by its ID
 */
export const updateComment = async (
  commentId: string,
  text: string
): Promise<IComment | null> => {
  if (!text) {
    throw new Error("Text is required for update");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { text },
    { new: true } // return the updated document
  );

  return updatedComment;
};
