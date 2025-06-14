import { Router } from 'express';
import { signup, login } from './auth.controller';
import { validateDto } from '../common/middlewares/validate';
import { SignupDto } from '../dtos/auth.dto';

const router = Router();

router.post('/signup', validateDto(SignupDto), signup);

router.post('/login', login);

export default router;
