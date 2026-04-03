
import { AuditableBaseModel } from "../_base/base.model";

export interface ProjectTeamResponseModel extends AuditableBaseModel {
  projectId: string;       // Guid → string
  teamId: string;          // Guid → string
  responsibleFor: string | null;

  isPrimary: boolean;
  assignedAt: string;      // DateTime → ISO string
  isRemoved: boolean;      // True if Team is removed from Project
  removedAt?: string;      // DateTime? → optional ISO string

  // Mapped from Team entity
  name: string;
  isArchived: boolean;
}
