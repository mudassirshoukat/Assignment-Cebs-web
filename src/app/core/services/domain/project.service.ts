import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { PagedResult } from '../../models/_pagination/paged-result-response.model';
import { PaginationParamsRequest } from '../../models/_pagination/pagination-params-request.model';
import { ProjectDetailResponseModel } from '../../models/project/project-detail-response.model';
import { ProjectResponseModel } from '../../models/project/project-response.model';
import { ArchiveProjectRequestModel } from '../../models/project/requests/archive-project-request.model';
import { CreateProjectRequestModel } from '../../models/project/requests/create-project-request.model';
import { UpdateProjectRequestModel } from '../../models/project/update-project-request.model';
import { HttpService } from '../infrastructure/http.service';
import { ProjectDashboardAdminResponseModel } from '../../models/project/project-dashboard-admin-response.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0); // optional if you want to persist total pages

  constructor(private httpService: HttpService) { }

  getProjects(
    params?: PaginationParamsRequest,
  ): Observable<PagedResult<ProjectResponseModel>> {
    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
    };
    const res = this.httpService.get<PagedResult<ProjectResponseModel>>(
      API_ENDPOINTS.Projects.GetList,
      query,
    );
    return res.pipe(
      tap((response: PagedResult<ProjectResponseModel>) => {
        this.pageNumber.set(response.pageNumber);
        this.pageSize.set(response.pageSize);
        this.orderByLatest.set(response.orderByLatest);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        console.log('Fetched projects:', response);
      }),
    );
  }

  getById(id: string): Observable<ProjectDetailResponseModel> {
    return this.httpService
      .get<ProjectDetailResponseModel>(API_ENDPOINTS.Projects.GetById(id))
      .pipe(tap((response: ProjectDetailResponseModel) => { }));
  }

  getAdminDashboardById(id: string): Observable<ProjectDashboardAdminResponseModel> {
    return this.httpService
      .get<ProjectDashboardAdminResponseModel>(API_ENDPOINTS.Projects.GetAdminDashboardById(id))
      .pipe(tap((response: ProjectDashboardAdminResponseModel) => { }));
  }

  
  create(request: CreateProjectRequestModel): Observable<ProjectResponseModel> {
    return this.httpService
      .post<ProjectResponseModel>(API_ENDPOINTS.Projects.Create, request)
      .pipe(tap((response: ProjectResponseModel) => { }));
  }

  update(request: UpdateProjectRequestModel): Observable<ProjectResponseModel> {
    return this.httpService
      .put<ProjectResponseModel>(API_ENDPOINTS.Projects.Update, request)
      .pipe(tap((response: ProjectResponseModel) => { }));
  }

  toggleArchive(
    request: ArchiveProjectRequestModel,
  ): Observable<ProjectResponseModel> {
    return this.httpService
      .patch<ProjectResponseModel>(API_ENDPOINTS.Projects.Archive, request)
      .pipe(tap((response: ProjectResponseModel) => { }));
  }
}
