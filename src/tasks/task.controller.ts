import { Response } from 'express';
import { AuthRequest } from '../common/middlewares/auth.middleware';
import * as TaskService from './task.service';
import moment from 'moment';

export const createTaskHandler = async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        const user_id = req.user?.id;

        const { task_name, task_description, start_date, due_date } = req.body;

        const task = await TaskService.createTask(user_id, task_name, task_description, new Date(start_date), new Date(due_date));

        res.status(200).json({ status: 'success', message: 'Task created successfully' });
        return;
    } catch (err: any) {
        res.status(500).json({ status: 'fail', errors: [err.message || 'Failed to create task'] });
        return;
    }
}

export const getAllTasksHandler = async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        const user_id = req.user?.id;

        const status = req.query.status as string;
        const raw_due_date = req.query.due_date as string;

        let due_date: string | undefined;

        if (raw_due_date) {
            const parsed = moment(raw_due_date, 'DD-MM-YYYY', true);
            if (!parsed.isValid()) {
                res.status(400).json({
                    status: 'fail',
                    errors: ['Invalid due_date format. Use DD-MM-YYYY']
                });

                return;
            }
            due_date = parsed.format('YYYY-MM-DD');
        }

        const tasks = await TaskService.getTasksByUser(user_id, status, due_date);

        const formated = tasks.map((task) => ({
            ...task,
            start_date: moment(task.start_date).format('DD-MM-YYYY'),
            due_date: moment(task.due_date).format('DD-MM-YYYY'),
            createdat: moment(task.createdat).format('DD-MM-YYYY'),
            updatedat: moment(task.updatedat).format('DD-MM-YYYY'),
            deletedat: task.deletedat ? moment(task.deletedat).format('DD-MM-YYYY') : ""
        }))

        res.status(200).json({ status: 'success', data: formated });

    } catch (err: any) {
        res.status(500).json({ status: 'fail', errors: [err.message || 'Failed to fetch tasks'] });
    }

}

export const getSingleTasksHandler = async (req: AuthRequest, res: Response): Promise<void> => {

    const task_id = req.params.id;

    try {

        const task_details = await TaskService.viewSingleTask(task_id);

        if (!task_details) {
            res.status(400).json({ status: 'fail', errors: ['Task not found'] });
            return;
        }

        res.status(200).json({
            status: 'success',
            data: {
                id: task_details.id,
                task_id: task_details.task_id,
                task_name: task_details.task_name,
                task_description: task_details.task_description,
                start_date: moment(task_details.start_date).format('DD-MM-YYYY'),
                due_date: moment(task_details.due_date).format('DD-MM-YYYY'),
                status: task_details.status,
                createdat: moment(task_details.createdat).format('DD-MM-YYYY'),
                updatedat: moment(task_details.updatedat).format('DD-MM-YYYY'),
                deletedat: task_details.deletedat ? moment(task_details.deletedat).format('DD-MM-YYYY') : null,
                is_active: task_details.is_active,
                task_logs: task_details.logs.map(log => ({
                    action: log.action,
                    timestamp: moment(log.timestamp).format('DD-MM-YYYY')
                }))
            }
        });


    } catch (err: any) {
        res.status(500).json({ status: 'fail', errors: [err.message || 'Failed to View task'] });
        return;
    }

}

export const updateTaskHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {

        const task_id = req.params.id;

        const updatedTask = await TaskService.updateTask(task_id, req.body);

        if (!updatedTask) {
            res.status(404).json({ status: 'fail', errors: ['Task not found or inactive'] });
            return
        }

        res.status(200).json({ status: 'success', message: 'Task updated successfully', });
        return
    } catch (err: any) {
        res.status(500).json({ status: 'fail', errors: [err.message || 'Failed to update task'] });
    }
};

export const markTaskCompletedHandler = async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        const task_id = req.params.id;
        const updatedTask = await TaskService.completeTask(task_id);

        if (!updatedTask) {
            res.status(404).json({ status: 'fail', errors: ['Task not found or already completed/inactive'] });
            return;
        }

        res.status(200).json({ status: 'success', message: 'Task marked as completed', });
        return

    } catch (err: any) {
        res.status(500).json({ status: 'fail', errors: [err.message || 'Failed to Complete task'] });
    }

}

export const deleteHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {

        const task_id = req.params.id;
        const deleted = await TaskService.deleteTask(task_id);

        if (!deleted) {
            res.status(404).json({ status: 'fail', errors: ['Task not found or already deleted'] });
            return
        }

        res.status(200).json({ status: 'success', message: 'Task deleted successfully' });

    } catch (err: any) {
        res.status(500).json({
            status: 'fail',
            errors: [err.message || 'Failed to delete task']
        });
    }
};
