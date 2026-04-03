import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { PaginationParamsRequest } from "../../models/_pagination/pagination-params-request.model";
import { CreateTeamRequestModel } from "../../models/team/create-team-request.model";
import { TeamDetailResponseModel } from "../../models/team/team-detail-response.model";
import { TeamResponseModel } from "../../models/team/team-response.model";
import { HttpService } from "../infrastructure/http.service";
import { ArchiveTeamRequestModel } from "../../models/team/archive-team-request.model";
import { UpdateTeamRequestModel } from "../../models/team/update-team-request.model";
import { CreateTeamWithMembersRequestModel } from "../../models/team/create-team-with-members-request.model";

@Injectable({ providedIn: 'root' })
export class TeamService {

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0);

  constructor(private httpService: HttpService) { }

  // =========================
  // Get paged list of teams
  // =========================
  getTeams(
    params?: PaginationParamsRequest
  ): Observable<PagedResult<TeamResponseModel>> {

    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest()
    };

    return this.httpService
      .get<PagedResult<TeamResponseModel>>(
        API_ENDPOINTS.Teams.GetList,
        query
      )
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched teams:', response);
        })
      );
  }

  // =========================
  // Get team by id
  // =========================
  getById(id: string): Observable<TeamDetailResponseModel> {
    return this.httpService
      .get<TeamDetailResponseModel>(
        API_ENDPOINTS.Teams.GetById(id)
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create team
  // =========================
  create(
    request: CreateTeamRequestModel
  ): Observable<TeamResponseModel> {
    return this.httpService
      .post<TeamResponseModel>(
        API_ENDPOINTS.Teams.Create,
        request
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create team with members
  // =========================
  createWithMembers(
    request: CreateTeamWithMembersRequestModel
  ): Observable<TeamResponseModel> {
    return this.httpService
      .post<TeamResponseModel>(
        API_ENDPOINTS.Teams.CreateWithMembers,
        request
      )
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }
 update(request: UpdateTeamRequestModel): Observable<TeamResponseModel> {
      return this.httpService.put<TeamResponseModel>(API_ENDPOINTS.Teams.Update, request).pipe(
        tap((response: TeamResponseModel) => {
        })
      );
    }


    
   toggleArchive(request: ArchiveTeamRequestModel): Observable<TeamResponseModel> {
      return this.httpService.patch<TeamResponseModel>(API_ENDPOINTS.Teams.Archive, request).pipe(
        tap((response: TeamResponseModel) => {
        })
      );
    }
}
