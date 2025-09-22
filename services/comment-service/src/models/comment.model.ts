export interface Comment {
  id: number;
  postId: number;
  userId: number;
  text: string;
  createdAt: Date;
}

export const comments: Comment[] = [];
