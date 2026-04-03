import { PaginationParamsRequest } from "../_pagination/pagination-params-request.model";

export interface GetProjectTeamListRequestModel extends PaginationParamsRequest {
  projectId: string;  // Guid →  string
  teamId?: string;     // Guid? → optional string
}

