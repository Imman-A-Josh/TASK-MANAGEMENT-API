import { IsNotEmpty } from 'class-validator';

export class TaskDto {

    @IsNotEmpty({ message: 'Task name is required' })
    task_name!: string;

    @IsNotEmpty({ message: 'Description is required' })
    task_description!: string;

    @IsNotEmpty({ message: 'Start Date is required' })
    start_date!: string;

    @IsNotEmpty({ message: 'Due Date is required' })
    due_date!: string;

}
