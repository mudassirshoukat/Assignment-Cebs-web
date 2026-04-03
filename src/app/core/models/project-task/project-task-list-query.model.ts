import { TaskPriorityEnum } from "../../enums/project-task/project-task-priority-status.enum";
import { TaskStatusEnum } from "../../enums/project-task/project-task-status.enum";
import { PaginationParamsRequest } from "../_pagination/pagination-params-request.model";

export interface GetProjectTaskListQuery extends PaginationParamsRequest {
  teamMemberId?: string;  // Guid → string
  projectId?: string;
  Status?: TaskStatusEnum;
  Priority?: TaskPriorityEnum;
}
