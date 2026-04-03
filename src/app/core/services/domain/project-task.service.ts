import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { PaginationParamsRequest } from "../../models/_pagination/pagination-params-request.model";
import { CreateProjectTaskRequestModel } from "../../models/project-task/create-project-task-request.model";
import { ProjectTaskDetailResponseModel } from "../../models/project-task/project-task-detail-response.model";
import { ProjectTaskResponseModel } from "../../models/project-task/project-task-response.model";
import { HttpService } from "../infrastructure/http.service";
import { UpdateProjectTaskRequestModel } from "../../models/project-task/update-project-task-request.model";
import { ProjectResponseModel } from "../../models/project/project-response.model";
import { ReassignProjectTaskRequestModel } from "../../models/project-task/reassign-project-task-request.model";
import { GetProjectTaskListQuery } from "../../models/project-task/project-task-list-query.model";
import { ProjectTaskWithAssigneeResponseModel } from "../../models/project-task/project-task-with-assignee-response.model";


@Injectable({ providedIn: 'root' })
export class ProjectTaskService {

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0);

  constructor(private httpService: HttpService) { }

  // =========================
  // Get paged list of tasks
  // =========================
  getTasks(param?: GetProjectTaskListQuery)
    : Observable<PagedResult<ProjectTaskResponseModel>> {

    const query: GetProjectTaskListQuery = {
      teamMemberId: param?.teamMemberId,
      projectId: param?.projectId,
      Status: param?.Status,
      Priority: param?.Priority,
      pageNumber: param?.pageNumber ?? this.pageNumber(),
      pageSize: param?.pageSize ?? this.pageSize(),
      orderByLatest: param?.orderByLatest ?? this.orderByLatest()
    };

    return this.httpService
      .get<PagedResult<ProjectTaskResponseModel>>(
        API_ENDPOINTS.ProjectTasks.GetList,
        query
      )
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched project tasks:', response);
        })
      );
  }

  // =========================
  // Get paged list of tasksWithAssigneeData
  // =========================
    getTaskWithAssigneeList(param?: GetProjectTaskListQuery)
    : Observable<PagedResult<ProjectTaskWithAssigneeResponseModel>> {

    const query: GetProjectTaskListQuery = {
      teamMemberId: param?.teamMemberId,
      projectId: param?.projectId,
      Status: param?.Status,
      Priority: param?.Priority,
      pageNumber: param?.pageNumber ?? this.pageNumber(),
      pageSize: param?.pageSize ?? this.pageSize(),
      orderByLatest: param?.orderByLatest ?? this.orderByLatest()
    };

    return this.httpService
      .get<PagedResult<ProjectTaskWithAssigneeResponseModel>>(
        API_ENDPOINTS.ProjectTasks.GetWithAssigneeList,
        query
      )
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched project tasks:', response);
        })
      );
  }
  // =========================
  // Get task by id
  // =========================
  getById(id: string): Observable<ProjectTaskDetailResponseModel> {
    return this.httpService
      .get<ProjectTaskDetailResponseModel>(
        API_ENDPOINTS.ProjectTasks.GetById(id)
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create project task
  // =========================
  create(
    request: CreateProjectTaskRequestModel
  ): Observable<ProjectTaskResponseModel> {
    return this.httpService
      .post<ProjectTaskResponseModel>(
        API_ENDPOINTS.ProjectTasks.Create,
        request
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

    update(request: UpdateProjectTaskRequestModel): Observable<ProjectTaskResponseModel> {
      return this.httpService.put<ProjectTaskResponseModel>(API_ENDPOINTS.ProjectTasks.Update, request).pipe(
        tap((response: ProjectTaskResponseModel) => {
        })
      );
    }
  
    reassign(request: ReassignProjectTaskRequestModel): Observable<ProjectTaskResponseModel> {
      return this.httpService.put<ProjectTaskResponseModel>(API_ENDPOINTS.ProjectTasks.Reassign, request).pipe(
        tap((response: ProjectTaskResponseModel) => {
        })
      );
    }
}
