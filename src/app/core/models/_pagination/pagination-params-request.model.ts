export interface PaginationParamsRequest {
  pageNumber?: number;     // optional, defaults on frontend
  pageSize?: number;       // optional
  orderByLatest?: boolean; // optional
}