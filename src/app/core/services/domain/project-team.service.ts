import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { PaginationParamsRequest } from "../../models/_pagination/pagination-params-request.model";
import { CreateProjectTeamRequestModel } from "../../models/project-team/create-project-team-request.model";
import { ProjectTeamDetailResponseModel } from "../../models/project-team/project-team-detail-response.model";
import { ProjectTeamResponseModel } from "../../models/project-team/project-team-response.model";
import { SetMainProjectTeamRequestModel } from "../../models/project-team/set-main-project-team-request.model";
import { HttpService } from "../infrastructure/http.service";
import { GetProjectTaskListQuery } from "../../models/project-task/project-task-list-query.model";
import { GetProjectTeamListRequestModel } from "../../models/project-team/project-team-list-query.model";
import { ProjectTeamStatsResponseModel } from "../../models/project-team/project-team-stats-response.model";
import { GetProjectTeamListlookupRequestModel } from "../../models/project-team/project-team-list-lookup-query.model";
import { ProjectTeamLookupResponseModel } from "../../models/project-team/project-team-lookup-response.model";

@Injectable({ providedIn: 'root' })
export class ProjectTeamService {

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0);

  constructor(private httpService: HttpService) { }

  // =========================
  // Get paged list of project teams
  // =========================
  getProjectTeams(
    params: GetProjectTeamListRequestModel
  ): Observable<PagedResult<ProjectTeamResponseModel>> {

    const query: GetProjectTeamListRequestModel = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
      projectId: params?.projectId,
      teamId: params?.teamId
    };

    return this.httpService
      .get<PagedResult<ProjectTeamResponseModel>>(
        API_ENDPOINTS.ProjectTeams.GetList,
        query
      )
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched project teams:', response);
        })
      );
  }


    // =========================
  // Get paged list of project teams
  // =========================
  getProjectTeamStatsList(
    params: GetProjectTeamListRequestModel
  ): Observable<PagedResult<ProjectTeamStatsResponseModel>> {

    const query: GetProjectTeamListRequestModel = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
      projectId: params?.projectId,
      teamId: params?.teamId
    };

    return this.httpService
      .get<PagedResult<ProjectTeamStatsResponseModel>>(
        API_ENDPOINTS.ProjectTeams.GetStatsList,
        query
      )
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched project teams:', response);
        })
      );
  }

  // =========================
  // Get paged list of project teams
  // =========================
  getProjectTeamListLookup(
    params: GetProjectTeamListlookupRequestModel
  ): Observable<ProjectTeamLookupResponseModel[]> {

    const query: GetProjectTeamListlookupRequestModel = {
      projectId: params?.projectId,
    };
    
    return this.httpService
      .get<ProjectTeamLookupResponseModel[]>(
        API_ENDPOINTS.ProjectTeams.GetListLookup,
        query
      )
      .pipe(
        tap((response) => {
          console.log('Fetched project teams List lookup:', response);
        })
      );
  }
  // =========================
  // Get single project team (custom endpoint)
  // =========================
  getSingle(
    projectId: string,
    teamId: string
  ): Observable<ProjectTeamDetailResponseModel> {
    return this.httpService
      .get<ProjectTeamDetailResponseModel>(
        API_ENDPOINTS.ProjectTeams.GetSingle,
        { projectId, teamId }
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create project team
  // =========================
  create(
    request: CreateProjectTeamRequestModel
  ): Observable<ProjectTeamResponseModel> {
    return this.httpService
      .post<ProjectTeamResponseModel>(
        API_ENDPOINTS.ProjectTeams.Create,
        request
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Set main team for project
  // =========================
  setMain(
    request: SetMainProjectTeamRequestModel
  ): Observable<void> {
    return this.httpService
      .post<void>(
        API_ENDPOINTS.ProjectTeams.SetMain,
        request
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }
}
