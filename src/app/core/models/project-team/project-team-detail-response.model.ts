import { AuditableBaseModel } from "../_base/base.model";
import { TeamMemberResponseModel } from "../team-member/team-member-response.model";

export interface ProjectTeamDetailResponseModel extends AuditableBaseModel {
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

  members: TeamMemberResponseModel[];
}
