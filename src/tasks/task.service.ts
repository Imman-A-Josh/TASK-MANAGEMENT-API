import { AppDataSource } from '../ormconfig';
import { Task, TaskLog } from './task.entity';
import { User } from '../users/user.entity';

const generateTaskId = async (): Promise<string> => {

    const taskRepo = AppDataSource.getRepository(Task);

    const latest = await taskRepo.find({
        order: { id: 'DESC' },
        take: 1
    });

    const lastId = latest[0]?.task_id?.replace('TASK', '') || '000';
    const nextId = String(Number(lastId) + 1).padStart(3, '0');

    return `TASK${nextId}`;
};

export const createTask = async (userId: number, task_name: string, task_description: string, start_date: Date, due_date: Date): Promise<Task> => {

    const taskRepo = AppDataSource.getRepository(Task);
    const logRepo = AppDataSource.getRepository(TaskLog);
    const userRepo = AppDataSource.getRepository(User);

    const task_id = await generateTaskId();

    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) throw new Error('User not found');

    const task = taskRepo.create({
        task_id,
        task_name,
        task_description,
        start_date,
        due_date,
        status: 'pending',
        user
    });

    const savedTask = await taskRepo.save(task);

    const log = logRepo.create({
        task: savedTask,
        action: 'created'
    });
    await logRepo.save(log);

    return savedTask;
};

export const getTasksByUser = async (userId: number, status?: string, due_date?: string): Promise<Task[]> => {

    const taskRepo = AppDataSource.getRepository(Task);

    const query = taskRepo.createQueryBuilder('task')
        .where('task.userId = :userId', { userId })
        .andWhere('task.is_active = :active', { active: 1 });

    if (status) {
        query.andWhere('task.status = :status', { status });
    }

    if (due_date) {
        query.andWhere('DATE(task.due_date) = DATE(:dueDate)', { dueDate: due_date });
    }

    query.orderBy('task.createdat', 'DESC');

    return await query.getMany();
};

export const viewSingleTask = async (task_id: string): Promise<Task | null> => {

    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOne({
        where: { task_id },
        relations: ['logs']
    })

    if (!task) throw new Error('Task not found');

    return task;

}

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {

    const taskRepo = AppDataSource.getRepository(Task);
    const logRepo = AppDataSource.getRepository(TaskLog);

    const task = await taskRepo.findOne({
        where: {
            task_id: taskId,
            is_active: 1
        }
    });

    if (!task) return null;

    task.task_name = updates.task_name ?? task.task_name;
    task.task_description = updates.task_description ?? task.task_description;
    task.start_date = updates.start_date ?? task.start_date;
    task.due_date = updates.due_date ?? task.due_date;

    const updated = await taskRepo.save(task);

    const log = logRepo.create({
        task: updated,
        action: 'updated'
    });

    await logRepo.save(log);

    return updated;
};

export const completeTask = async (task_id: string): Promise<Task | null> => {

    const taskRepo = AppDataSource.getRepository(Task);
    const logRepo = AppDataSource.getRepository(TaskLog);

    const task = await taskRepo.findOne({
        where: {
            task_id: task_id,
            is_active: 1
        }
    });

    if (!task || task.status === 'completed') return null;

    task.status = 'completed';

    const saved = await taskRepo.save(task);

    const log = logRepo.create({
        task: saved,
        action: 'completed'
    });

    await logRepo.save(log);

    return saved;
};

export const deleteTask = async (taskId: string): Promise<boolean> => {

    const taskRepo = AppDataSource.getRepository(Task);
    const logRepo = AppDataSource.getRepository(TaskLog);

    const task = await taskRepo.findOne({
        where: {
            task_id: taskId,
            is_active: 1
        }
    });

    if (!task) return false;

    task.is_active = 0;

    await taskRepo.save(task);

    const log = logRepo.create({
        task,
        action: 'deleted'
    });

    await logRepo.save(log);

    return true;
};
