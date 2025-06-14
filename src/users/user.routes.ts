import { Router } from "express";
import { getMyProfile } from "./user.controller";
import { verifyToken } from "../common/middlewares/auth.middleware";

const router = Router();

router.get('/me', verifyToken, getMyProfile)

export default router;