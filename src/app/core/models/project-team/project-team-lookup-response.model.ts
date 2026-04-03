
import { AuditableBaseModel } from "../_base/base.model";

export interface ProjectTeamLookupResponseModel extends AuditableBaseModel {
  projectId: string;       // Guid → string
  teamId: string;          // Guid → string
  isPrimary: boolean;
  // Mapped from Team entity
  name: string;
}
