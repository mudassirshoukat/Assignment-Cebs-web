import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { PaginationParamsRequest } from "../../models/_pagination/pagination-params-request.model";
import { HttpService } from "../infrastructure/http.service";
import { JobTitleResponseModel } from "../../models/job-title/job-title-response.model";
import { JobTitleDetailResponseModel } from "../../models/job-title/job-title-detail-response.model";
import { CreateJobTitleRequestModel } from "../../models/job-title/request/create-job-title-request.model";
import { UpdateJobTitleRequestModel } from "../../models/job-title/request/update-job-title-request.model";
import { JobTitleWithEmployeeCountResponseModel } from "../../models/job-title/job-title-with-employee-count-response.model";
import { GetJobTitleListQuery } from "../../models/job-title/request/job-title-list-query.model";


@Injectable({ providedIn: 'root' })
export class JobTitleService {

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0);

  constructor(private httpService: HttpService) { }

  // =========================
  // Get paged list of job titles
  // =========================
  getJobTitles(params?: GetJobTitleListQuery): Observable<PagedResult<JobTitleWithEmployeeCountResponseModel>> {
    const query: GetJobTitleListQuery = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
      departmentId: params?.departmentId!
    };

    return this.httpService
      .get<PagedResult<JobTitleWithEmployeeCountResponseModel>>(API_ENDPOINTS.JobTitles.GetList, query)
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched job titles:', response);
        })
      );
  }

  // =========================
  // Get job title by ID
  // =========================
  getById(id: string): Observable<JobTitleDetailResponseModel> {
    return this.httpService
      .get<JobTitleDetailResponseModel>(API_ENDPOINTS.JobTitles.GetById(id))
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create job title
  // =========================
  create(request: CreateJobTitleRequestModel): Observable<JobTitleResponseModel> {
    return this.httpService
      .post<JobTitleResponseModel>(API_ENDPOINTS.JobTitles.Create, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Update job title
  // =========================
  update(request: UpdateJobTitleRequestModel): Observable<JobTitleResponseModel> {
    return this.httpService
      .put<JobTitleResponseModel>(API_ENDPOINTS.JobTitles.Update, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Toggle isActive / archive
  // =========================
  toggleActive(request: CreateJobTitleRequestModel): Observable<JobTitleResponseModel> {
    return this.httpService
      .patch<JobTitleResponseModel>(API_ENDPOINTS.JobTitles.ToggleIsActive, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Get lookup list for dropdowns
  // =========================
  getLookup(departmentId: string): Observable<JobTitleResponseModel[]> {
    return this.httpService
      .get<JobTitleResponseModel[]>(API_ENDPOINTS.JobTitles.GetListLookup, { departmentId })
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }
}
