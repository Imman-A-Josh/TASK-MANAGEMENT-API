import { Request, Response } from 'express';
import * as AuthService from './auth.service';

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, email, phone, password, confirm_password } = req.body;

        if (password !== confirm_password) {
            res.status(400).json({ status: "fail", error: ['Passwords do not match'] });
            return;
        }

        await AuthService.signup({ first_name, last_name, email, phone, password, })

        res.status(200).json({ status: "success", message: "User Created Successfully" });
    } catch (err: any) {
        res.status(500).json({ status: "fail", errors: [err.message || "Something went wrong"] });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {

        if (!req.body || typeof req.body !== 'object') {
            res.status(400).json({ status: "fail", errors: ["Request body is missing or invalid"] });
            return;
        }

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ status: "fail", errors: ["Email and password are required"] });
            return;
        }

        const token = await AuthService.login(email, password);

        res.status(200).json({ status: "success", message: "Login successful", token: token });

    } catch (err: any) {
        res.status(500).json({ status: "fail", errors: [err.message || "Login Failed"] });
    }
};
