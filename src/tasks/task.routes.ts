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


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management routes
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [task_name, start_date, due_date]
 *             properties:
 *               task_name:
 *                 type: string
 *               task_description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get list of tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: due_date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of tasks
 */

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details
 */

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_name:
 *                 type: string
 *               task_description:
 *                 type: string
 *               status:
 *                 type: string
 *               start_date:
 *                 type: string
 *               due_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */

/**
 * @swagger
 * /tasks/{id}/complete:
 *   patch:
 *     summary: Mark a task as completed
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task completed
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Soft delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted
 */

