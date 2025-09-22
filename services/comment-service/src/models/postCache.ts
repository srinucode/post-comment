export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

export const postsCache: Post[] = [];
