export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
}

export const posts: Post[] = [];
