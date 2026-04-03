import { AuditableBaseModel } from "../_base/base.model";
import { TeamMemberResponseModel } from "../team-member/team-member-response.model";

export interface TeamDetailResponseModel extends AuditableBaseModel {
  name: string;
  isArchived: boolean;

  members: TeamMemberResponseModel[];
}
