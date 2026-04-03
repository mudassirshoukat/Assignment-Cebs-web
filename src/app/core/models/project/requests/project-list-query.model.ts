import { PaginationParamsRequest } from '../../_pagination/pagination-params-request.model';

export interface GetProjectListQuery extends PaginationParamsRequest {
  getByEmployee: boolean;
}
