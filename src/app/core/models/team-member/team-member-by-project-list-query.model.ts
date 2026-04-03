import { PaginationParamsRequest } from "../_pagination/pagination-params-request.model";

export interface GetTeamMemberListByProjectRequestModel extends PaginationParamsRequest {
  teamId?: string;      // Guid? → optional string
  projectId?: string;   // Guid? → optional string
}

