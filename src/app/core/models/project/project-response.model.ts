import { ProjectPriorityEnum } from "../../enums/project/project-priority.enum";
import { ProjectStatusEnum } from "../../enums/project/project-status.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { EmployeeResponseModel } from "../employee/employee-response.model";

export interface ProjectResponseModel extends AuditableBaseModel {
  projectManagerId?: string;

  name: string;
  description: string;

  status: ProjectStatusEnum;
  priority: ProjectPriorityEnum;

  startDate?: string; // DateOnly?
  endDate?: string;   // DateOnly?

  isArchived: boolean;

  projectManager?: EmployeeResponseModel;
}


