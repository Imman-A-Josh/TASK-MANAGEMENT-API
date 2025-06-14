import { Router } from "express";
import { getMyProfile } from "./user.controller";
import { verifyToken } from "../common/middlewares/auth.middleware";

const router = Router();

router.get('/me', verifyToken, getMyProfile)

export default router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User account and profile operations
 */


/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Details
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 */
