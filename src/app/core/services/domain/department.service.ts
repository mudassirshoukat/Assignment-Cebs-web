import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { PaginationParamsRequest } from "../../models/_pagination/pagination-params-request.model";
import { HttpService } from "../infrastructure/http.service";
import { DepartmentResponseModel } from "../../models/department/department-response.model";
import { DepartmentDetailResponseModel } from "../../models/department/department-detail-response.model";
import { CreateDepartmentRequestModel } from "../../models/department/request/create-department-request.model";
import { UpdateDepartmentRequestModel } from "../../models/department/request/update-department-request.model";
import { ArchiveDepartmentRequestModel } from "../../models/department/request/archive-department-request.model";

@Injectable({ providedIn: 'root' })
export class DepartmentService {

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0);

  constructor(private httpService: HttpService) { }

  // =========================
  // Get paged list of departments
  // =========================
  getDepartments(params?: PaginationParamsRequest): Observable<PagedResult<DepartmentResponseModel>> {
    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest()
    };

    return this.httpService
      .get<PagedResult<DepartmentResponseModel>>(API_ENDPOINTS.Departments.GetList, query)
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched departments:', response);
        })
      );
  }

  // =========================
  // Get department by ID
  // =========================
  getById(id: string): Observable<DepartmentDetailResponseModel> {
    return this.httpService
      .get<DepartmentDetailResponseModel>(API_ENDPOINTS.Departments.GetById(id))
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create department
  // =========================
  create(request: CreateDepartmentRequestModel): Observable<DepartmentResponseModel> {
    return this.httpService
      .post<DepartmentResponseModel>(API_ENDPOINTS.Departments.Create, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Update department
  // =========================
  update(request: UpdateDepartmentRequestModel): Observable<DepartmentResponseModel> {
    return this.httpService
      .put<DepartmentResponseModel>(API_ENDPOINTS.Departments.Update, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Toggle isActive / archive
  // =========================
  toggleActive(request: ArchiveDepartmentRequestModel): Observable<DepartmentResponseModel> {
    return this.httpService
      .patch<DepartmentResponseModel>(API_ENDPOINTS.Departments.ToggleIsActive, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Get lookup list for dropdowns
  // =========================
  getLookup(): Observable<DepartmentResponseModel[]> {
    return this.httpService
      .get<DepartmentResponseModel[]>(API_ENDPOINTS.Departments.GetListLookup)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }
}
