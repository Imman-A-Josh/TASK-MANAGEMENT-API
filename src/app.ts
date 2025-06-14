import express from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';
import taskRoutes from './tasks/task.routes';

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

export default app;
