import { User } from './user.entity';
import { AppDataSource } from '../ormconfig';

export const getUserById = async (id: number) => {
    const userRepo = AppDataSource.getRepository(User);
    return await userRepo.findOne({ where: { id } });
};
