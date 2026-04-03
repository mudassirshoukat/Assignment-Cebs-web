import { DesignationLevelEnum } from "../../../enums/designation/designation-level.enum";


export interface CreateDesignationRequestModel {
  name: string;
  description: string;
  rank?: number; // optional, if null it will be appended at last

  // Authority / permission flags
  isSingleSeat: boolean;
  shiftRanksDown: boolean;
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
