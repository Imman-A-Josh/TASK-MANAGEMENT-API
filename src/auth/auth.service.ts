import bcrypt from "bcrypt";
import { AppDataSource } from "../ormconfig";
import { User } from "../users/user.entity";
import jwt from 'jsonwebtoken';

interface SignupPayload {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
}

export const signup = async ({ first_name, last_name, email, phone, password }: SignupPayload) => {

    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOne({ where: { email, status: 1 } });

    if (existing) throw new Error('User already exists');

    const hashed = await bcrypt.hash(password, 10);

    const user = userRepo.create({ first_name, last_name, email, phone, password: hashed, });

    await userRepo.save(user);
    return user;
};


export const login = async (email: string, password: string) => {

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
        throw new Error('Invalid Email Details');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Password Details');
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );

    return token;
}