import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { PaginationParamsRequest } from "../../models/_pagination/pagination-params-request.model";
import { CreateTeamMemberRequestModel } from "../../models/team-member/create-team-member-request.model";
import { TeamMemberResponseModel } from "../../models/team-member/team-member-response.model";
import { HttpService } from "../infrastructure/http.service";
import { TeamMemberWithTaskCountResponseModel } from "../../models/team-member/team-member--task-count-response.model";
import { GetTeamMemberListRequestModel } from "../../models/team-member/team-member-list-query.model";
import { GetTeamMemberListByProjectRequestModel } from "../../models/team-member/team-member-by-project-list-query.model";


@Injectable({ providedIn: 'root' })
export class TeamMemberService {

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0);

  constructor(private httpService: HttpService) { }

  // =========================
  // Get paged list of team members
  // =========================
  getTeamMembers(
    params?: PaginationParamsRequest
  ): Observable<PagedResult<TeamMemberResponseModel>> {

    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest()
    };

    return this.httpService
      .get<PagedResult<TeamMemberResponseModel>>(
        API_ENDPOINTS.TeamMembers.GetList,
        query
      )
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched team members:', response);
        })
      );
  }

    // =========================
  // Get paged list of team members
  // =========================
  getTeamMemberWithTaskCountList(
    params?: GetTeamMemberListByProjectRequestModel
  ): Observable<PagedResult<TeamMemberWithTaskCountResponseModel>> {

    const query: GetTeamMemberListByProjectRequestModel = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
      projectId: params?.projectId,
      teamId: params?.teamId
    };

    return this.httpService
      .get<PagedResult<TeamMemberWithTaskCountResponseModel>>(
        API_ENDPOINTS.TeamMembers.GetWithTaskCountList,
        query
      )
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
           // Fix: pageSize cannot exceed totalRecords if totalRecords > 0
    if (response.totalCount > 0 && response.pageSize > response.totalCount) {
      this.pageSize.set(response.totalCount);
    }

          console.log('Fetched team members:', response);
        })
      );
  }
  // =========================
  // Get team member by id
  // =========================
  getById(id: string): Observable<TeamMemberResponseModel> {
    return this.httpService
      .get<TeamMemberResponseModel>(
        API_ENDPOINTS.TeamMembers.GetById(id)
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create team member
  // =========================
  create(
    request: CreateTeamMemberRequestModel
  ): Observable<TeamMemberResponseModel> {
    return this.httpService
      .post<TeamMemberResponseModel>(
        API_ENDPOINTS.TeamMembers.Create,
        request
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }
}
