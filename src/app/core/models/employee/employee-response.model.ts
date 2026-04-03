import { RoleEnum } from "../../enums/role.enum";
import { AuditableBaseModel } from "../_base/base.model";

export interface EmployeeResponseModel extends AuditableBaseModel {
  userId: string;           // Guid → string
  publicId: string; //// e.g., EMP-1001

  // Foreign key for the parent/manager relationship. Nullable for the top-level employee.
  supervisorId?: string;    // Guid? → optional string
  designationId: string;    // Guid →  string
  jobTitleId?: string;    // Guid? → optional string

  email: string;
  firstName: string;
  lastName: string;
  fullName: string;         // Computed property from backend,derive as `${firstName} ${lastName}`.trim()
  isOrphen:boolean; //should be alert/danger row specifys this employee currenly not in org hierary settled
  isActive:boolean;
}
