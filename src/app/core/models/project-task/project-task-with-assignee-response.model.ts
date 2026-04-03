
import { TaskPriorityEnum } from "../../enums/project-task/project-task-priority-status.enum";
import { TaskStatusEnum } from "../../enums/project-task/project-task-status.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { TeamMemberResponseModel } from "../team-member/team-member-response.model";

export interface ProjectTaskWithAssigneeResponseModel extends AuditableBaseModel {
  projectId: string;

  assigneeId: string;
  assignorId: string;
  approverId?: string | null;

  title: string;
  description?: string;

  status: TaskStatusEnum;
  priority: TaskPriorityEnum;

  dueDate?: string | null;
  requiresApproval: boolean;
  assignee: TeamMemberResponseModel;

}
