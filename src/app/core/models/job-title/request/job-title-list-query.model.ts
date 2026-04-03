import { PaginationParamsRequest } from '../../_pagination/pagination-params-request.model';

export interface GetJobTitleListQuery extends PaginationParamsRequest {
  departmentId: string;
}
