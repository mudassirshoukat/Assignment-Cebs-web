
import { TaskPriorityEnum } from "../../enums/project-task/project-task-priority-status.enum";
import { TaskStatusEnum } from "../../enums/project-task/project-task-status.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { TeamMemberResponseModel } from "../team-member/team-member-response.model";

export interface ProjectTaskDetailResponseModel extends AuditableBaseModel {
  projectId: string;

  // IDs
  assigneeId: string;
  assignorId: string;
  approverId?: string | null;

  // Core fields
  title: string;
  description?: string;

  status: TaskStatusEnum;
  priority: TaskPriorityEnum;

  dueDate?: string | null;
  requiresApproval: boolean;

  // Related members
  assignee: TeamMemberResponseModel;
  assignor: TeamMemberResponseModel;
  approver?: TeamMemberResponseModel | null;
}
