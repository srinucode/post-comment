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

/** Delete all posts by userId and return deleted posts */
export const deletePostsByUserId = async (userId: string): Promise<IPost[]> => {
  // 1. Find posts before deleting
  const postsToDelete = await Post.find({ userId });

  if (postsToDelete.length > 0) {
    // 2. Delete them
    await Post.deleteMany({ userId });
  }

  // 3. Return deleted posts so controller can publish events
  return postsToDelete;
};

// Get multiple posts by IDs
export const getPostsByIds = async (postIds: string[]): Promise<IPost[]> => {
  return await Post.find({ _id: { $in: postIds } }).exec();
};

// Get all posts of a user
export const getPostsByUser = async (userId: string): Promise<IPost[]> => {
  return await Post.find({ userId }).exec();
};
