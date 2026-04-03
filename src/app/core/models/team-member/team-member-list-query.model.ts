import { PaginationParamsRequest } from "../_pagination/pagination-params-request.model";

export interface GetTeamMemberListRequestModel extends PaginationParamsRequest {
  employeeId?: string;  // Guid? → optional string
  teamId?: string;      // Guid? → optional string
}

