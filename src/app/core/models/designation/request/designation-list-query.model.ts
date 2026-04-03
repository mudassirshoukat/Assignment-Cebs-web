import { DesignationLevelEnum } from '../../../enums/designation/designation-level.enum';
import { PaginationParamsRequest } from '../../_pagination/pagination-params-request.model';

export interface GetDesignationListQuery extends PaginationParamsRequest {
  level?: DesignationLevelEnum;
}
