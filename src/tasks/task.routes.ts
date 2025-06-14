import { Router } from 'express';
import { createTaskHandler, getAllTasksHandler, getSingleTasksHandler, updateTaskHandler, markTaskCompletedHandler, deleteHandler } from './task.controller';
import { verifyToken } from '../common/middlewares/auth.middleware';
import { validateDto } from '../common/middlewares/validate';
import { TaskDto } from '../dtos/task.dto';

const router = Router();

router.post('/', verifyToken, validateDto(TaskDto), createTaskHandler);

router.get('/', verifyToken, getAllTasksHandler);

router.get('/:id', verifyToken, getSingleTasksHandler);

router.put('/:id', verifyToken, validateDto(TaskDto), updateTaskHandler);

router.patch('/:id/complete', verifyToken, markTaskCompletedHandler);

router.delete('/:id', verifyToken, deleteHandler);

export default router;
