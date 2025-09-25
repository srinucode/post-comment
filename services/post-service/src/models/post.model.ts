/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - text
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           example: "650f0b7f1a2d3a1c12345678"
 *         userId:
 *           type: string
 *           example: "650f0a9e1a2d3a1c87654321"
 *         text:
 *           type: string
 *           example: "This is a sample post"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-25T12:34:56.789Z"
 */
export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
}

export const posts: Post[] = [];
