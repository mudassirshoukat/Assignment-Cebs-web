import { TaskPriorityEnum } from "../../enums/project-task/project-task-priority-status.enum";

export interface UpdateProjectTaskRequestModel {
    id: string; // Guid -> string
    title: string;
    description?: string; // nullable in C#
    priority: TaskPriorityEnum;
    dueDate: string; // DateTime -> string or Date
}
