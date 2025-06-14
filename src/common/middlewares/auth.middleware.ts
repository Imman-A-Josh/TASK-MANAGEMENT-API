import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ status: "fail", errors: ['Authorization token missing or invalid'] })
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        req.user = decoded;
        next()
    } catch (error: any) {
        res.status(401).json({ status: 'fail', errors: ['Invalid or expired token'] });
        return;
    }

}