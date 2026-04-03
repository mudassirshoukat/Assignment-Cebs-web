import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { PagedResult } from '../../models/_pagination/paged-result-response.model';
import { PaginationParamsRequest } from '../../models/_pagination/pagination-params-request.model';
import { AcceptInvitationRequestModel } from '../../models/invitation/accept-invitation-request.model';
import { CreateInvitationRequestModel } from '../../models/invitation/create-invitation-request.model';
import { InvitationDetailResponse } from '../../models/invitation/invitation-detail-response.model';
import { InvitationResponse } from '../../models/invitation/invitation-response.model';
import { RevokeInvitationRequestModel } from '../../models/invitation/revoke-invitation-request.model';
import { UpdateInvitationRequestModel } from '../../models/invitation/update-invitation-request.model';
import { HttpService } from '../infrastructure/http.service';
import { InvitationWithTitlesResponseModel } from '../../models/invitation/invitation-with-titles-response.model';


@Injectable({ providedIn: 'root' })
export class InvitationService {


  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0); // optional if you want to persist total pages

  constructor(private httpService: HttpService) {
  }

  getInvitations(params?: PaginationParamsRequest)
    : Observable<PagedResult<InvitationResponse>> {

    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest()
    };
    const res = this.httpService.get<PagedResult<InvitationResponse>>(
      API_ENDPOINTS.Invitations.GetList,
      query
    );
    return res.pipe(
      tap((response: PagedResult<InvitationResponse>) => {

        this.pageNumber.set(response.pageNumber);
        this.pageSize.set(response.pageSize);
        this.orderByLatest.set(response.orderByLatest);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        console.log('Fetched invitations:', response);
      })
    );
  }

    getListWithTitles(params?: PaginationParamsRequest)
    : Observable<PagedResult<InvitationWithTitlesResponseModel>> {

    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest()
    };
    const res = this.httpService.get<PagedResult<InvitationWithTitlesResponseModel>>(
      API_ENDPOINTS.Invitations.GetListWithTitles,
      query
    );
    return res.pipe(
      tap((response: PagedResult<InvitationWithTitlesResponseModel>) => {

        this.pageNumber.set(response.pageNumber);
        this.pageSize.set(response.pageSize);
        this.orderByLatest.set(response.orderByLatest);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        console.log('Fetched invitations:', response);
      })
    );
  }


  getById(id: string): Observable<InvitationDetailResponse> {
    return this.httpService.get<InvitationDetailResponse>(API_ENDPOINTS.Invitations.GetById(id)).pipe(
      tap((response: InvitationDetailResponse) => {
      })
    );
  }
  getByToken(token: string): Observable<InvitationDetailResponse> {
    return this.httpService.get<InvitationDetailResponse>(API_ENDPOINTS.Invitations.GetByToken(token)).pipe(
      tap((response: InvitationDetailResponse) => {
      })
    );
  }


  create(request: CreateInvitationRequestModel): Observable<InvitationResponse> {
    return this.httpService.post<InvitationResponse>(API_ENDPOINTS.Invitations.Create, request).pipe(
      tap((response: InvitationResponse) => {
      })
    );
  }
  update(request: UpdateInvitationRequestModel): Observable<InvitationResponse> {
    return this.httpService.post<InvitationResponse>(API_ENDPOINTS.Invitations.Create, request).pipe(
      tap((response: InvitationResponse) => {
      })
    );
  }

  revoke(request: RevokeInvitationRequestModel): Observable<InvitationWithTitlesResponseModel> {
    return this.httpService.post<InvitationWithTitlesResponseModel>(API_ENDPOINTS.Invitations.Revoke, request).pipe(
      tap((response: InvitationWithTitlesResponseModel) => {
      })
    );
  }



  acceptInvite(request: AcceptInvitationRequestModel): Observable<InvitationResponse> {
    return this.httpService.post<InvitationResponse>(API_ENDPOINTS.Invitations.AcceptInvite, request).pipe(
      tap((response: InvitationResponse) => {
      })
    );
  }

}