import { TeamMemberRoleEnum } from "../../enums/team-member/team-member-role.enum";

export interface CreateTeamMemberRequestModel {
  employeeId: string;  // Guid → string
  teamId: string;      // Guid → string

  // Role of the employee within the team context
  teamRole: TeamMemberRoleEnum;
}