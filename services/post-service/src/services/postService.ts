import Post, { IPost } from "../models/Post";


/** Create a new post */
export const createPost = async (userId: string, text: string): Promise<IPost> => {
  if (!text) {
    throw new Error("Text is required");
  }

  const post = new Post({ userId, text });
  return await post.save();
};

/** Delete post by postId */
export const deletePostById = async (postId: string): Promise<IPost | null> => {
  console.log("Deleting post with ID:", postId);
  return await Post.findByIdAndDelete(postId);
};

/** Delete all posts by userId */
export const deletePostsByUserId = async (userId: string): Promise<{ deletedCount?: number }> => {
  return await Post.deleteMany({ userId });
};


// Get multiple posts by IDs
export const getPostsByIds = async (postIds: string[]): Promise<IPost[]> => {
  return await Post.find({ _id: { $in: postIds } }).exec();
};

// Get all posts of a user
export const getPostsByUser = async (userId: string): Promise<IPost[]> => {
  return await Post.find({ userId }).exec();
};
