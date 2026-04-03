import { DesignationLevelEnum } from "../../enums/designation/designation-level.enum";
import { AuditableBaseModel } from "../_base/base.model";

export interface DesignationResponseModel extends AuditableBaseModel {
  publicId: string; // e.g., DES-1001
  name: string;
  description?: string;
  rank: number;

  // Authority / permission flags
  canBeProjectManager: boolean;
  canBeTeamLead: boolean;
  canApproveTasks: boolean;
  canAssignTasks: boolean;
  canManageTeam: boolean;
  canManageProjects: boolean;
  canManageEmployees: boolean;
  canReviewReports: boolean;

  isActive: boolean;
  level: DesignationLevelEnum;
}
