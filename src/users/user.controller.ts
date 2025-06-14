import { Request, Response } from 'express';
import { AuthRequest } from '../common/middlewares/auth.middleware';
import { getUserById } from './user.service';

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await getUserById(req.user.id);

        if (!user) {
            res.status(400).json({ status: "fail", errors: ["User not found"] });
            return
        }

        const { password, ...safeUser } = user;

        res.status(200).json({ status: "success", message: "User Details", data: safeUser })
    } catch (error: any) {
        res.status(500).json({ status: "fail", errors: [error.message || "Something went wrong"] });
    }
}