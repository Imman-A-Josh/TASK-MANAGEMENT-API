import express from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';
import taskRoutes from './tasks/task.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger.config';
import cors from 'cors';


const app = express();
app.use(express.json());

app.use(cors());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
