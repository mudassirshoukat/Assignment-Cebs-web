import { TaskPriorityEnum } from "../../enums/project-task/project-task-priority-status.enum";

export interface CreateProjectTaskRequestModel {
  projectId: string;        // Guid → string
  assigneeId: string;
  assignorId: string;

  title: string;
  description?: string;

  priority: TaskPriorityEnum;

  dueDate: string;          // DateTime → ISO string
  requiresApproval: boolean;
}
