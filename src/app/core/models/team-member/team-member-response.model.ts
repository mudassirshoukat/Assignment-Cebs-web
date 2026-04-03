
import { TeamMemberRoleEnum } from "../../enums/team-member/team-member-role.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { EmployeeResponseModel } from "../employee/employee-response.model";

export interface TeamMemberResponseModel extends AuditableBaseModel {
  employeeId: string;       // Guid → string
  teamId: string;           // Guid → string
  teamName: string;
  joinedAt: string;         // DateTime → ISO string
  isLeft: boolean;
  leftAt?: Date;          // DateTime? → optional ISO string

  // Role of the employee within the team context
  teamRole: TeamMemberRoleEnum;

  employee: EmployeeResponseModel;
}
