/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         postId:
 *           type: string
 *         parentId:
 *           type: string
 *         userId:
 *           type: string
 *         text:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "66fb24cda4d95c2c8b9a1102"
 *         postId: "66fb23c9a4d95c2c8b9a10e1"
 *         parentId: null
 *         userId: "66fb240da4d95c2c8b9a10f0"
 *         text: "This is a comment"
 *         createdAt: "2025-09-25T12:34:56.789Z"
 *         updatedAt: "2025-09-25T12:34:56.789Z"
 *
 *     DeleteResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *       required:
 *         - success
 *         - message
 *       example:
 *         success: true
 *         message: "Comments deleted successfully"
 */
