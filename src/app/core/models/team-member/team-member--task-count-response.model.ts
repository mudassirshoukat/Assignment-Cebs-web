
import { TeamMemberRoleEnum } from "../../enums/team-member/team-member-role.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { EmployeeResponseModel } from "../employee/employee-response.model";

export interface TeamMemberWithTaskCountResponseModel extends AuditableBaseModel {
  employeeId: string;       // Guid → string
  teamId: string;           // Guid → string
  teamName: string;
  joinedAt: string;         // DateTime → ISO string
  isLeft: boolean;
  leftAt?: Date;          // DateTime? → optional ISO string
  taskCount: number;       // Number of tasks assigned to the team member
  taskCompletedCount: number; // Number of tasks completed by the team member
  teamRole: TeamMemberRoleEnum;// Role of the employee within the team context

  employee: EmployeeResponseModel;
}
