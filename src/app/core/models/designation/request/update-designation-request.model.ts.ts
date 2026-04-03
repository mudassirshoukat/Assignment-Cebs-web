import { DesignationLevelEnum } from "../../../enums/designation/designation-level.enum";

export interface UpdateDesignationRequestModel {
  id: string; // Guid of the designation
  name: string;
  description: string;
  rank?: number;

  // Authority / permission flags
  canBeProjectManager: boolean;
  canBeTeamLead: boolean;
  canApproveTasks: boolean;
  canAssignTasks: boolean;
  canManageTeam: boolean;
  canManageProjects: boolean;
  canManageEmployees: boolean;
  canReviewReports: boolean;

  level: DesignationLevelEnum;
}
