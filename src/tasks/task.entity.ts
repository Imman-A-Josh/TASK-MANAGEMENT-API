import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    task_id!: string;

    @Column()
    task_name!: string;

    @Column({ nullable: true })
    task_description!: string;

    @Column()
    start_date!: Date;

    @Column()
    due_date!: Date;

    @Column({ default: 'pending' })
    status!: string;

    @CreateDateColumn()
    createdat!: Date;

    @UpdateDateColumn()
    updatedat!: Date;

    @DeleteDateColumn()
    deletedat?: Date;

    @ManyToOne(() => User)
    user!: User;

    @Column({ default: 1 })
    is_active!: number;

    @OneToMany(() => TaskLog, log => log.task)
    logs!: TaskLog[];
}

@Entity()
export class TaskLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Task, task => task.logs)
    task!: Task;

    @Column()
    action!: string;

    @CreateDateColumn()
    timestamp!: Date;
}