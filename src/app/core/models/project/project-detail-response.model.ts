import { InvitationSourceEnum } from "../../enums/invitation/invitation-source.enum";
import { InvitationStatusEnum } from "../../enums/invitation/invitation-status.enum";
import { ProjectStatusEnum } from "../../enums/project/project-status.enum";
import { RoleEnum } from "../../enums/role.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { EmployeeResponseModel } from "../employee/employee-response.model";
import { ProjectTaskResponseModel } from "../project-task/project-task-response.model";
import { ProjectTeamResponseModel } from "../project-team/project-team-response.model";
import { UserResponseModel } from "../user/user-response.model";
import { ProjectResponseModel } from "./project-response.model";
export interface ProjectDetailResponseModel extends ProjectResponseModel {
  projectManager?: EmployeeResponseModel
  projectTeams: ProjectTeamResponseModel[];
  tasks: ProjectTaskResponseModel[];
}
