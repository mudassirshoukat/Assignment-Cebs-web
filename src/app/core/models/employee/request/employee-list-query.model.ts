import { DesignationLevelEnum } from "../../../enums/designation/designation-level.enum";
import { PaginationParamsRequest } from "../../_pagination/pagination-params-request.model";

export interface GetEmployeeListQuery extends PaginationParamsRequest {
  departmentId?: string;
  jobTitle?: string;
  designationId?: string;

  // New filters for capabilities
  canManageProjects?: boolean;
  canBeProjectManager?: boolean;
  isOrphen?: boolean;

  // New filter for designation level
  level?: DesignationLevelEnum;
}