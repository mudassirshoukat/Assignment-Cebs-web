
import { AuditableBaseModel } from "../_base/base.model";
import { ProjectTeamResponseModel } from "./project-team-response.model";

export interface ProjectTeamStatsResponseModel extends ProjectTeamResponseModel {
  memberCount: number;
  taskCount: number;
  progressPercentage: number;
}
