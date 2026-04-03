import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { DesignationLevelEnum } from "../../enums/designation/designation-level.enum";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { DesignationResponseModel } from "../../models/designation/designation-response.model";
import { DesignationWithCountResponseModel } from "../../models/designation/designation-with-count-response.model";
import { ArchiveDesignationRequestModel } from "../../models/designation/request/archive-designation-request.model";
import { CreateDesignationRequestModel } from "../../models/designation/request/create-designation-request.model";
import { GetDesignationListQuery } from "../../models/designation/request/designation-list-query.model";
import { UpdateDesignationRequestModel } from "../../models/designation/request/update-designation-request.model.ts";
import { HttpService } from "../infrastructure/http.service";

@Injectable({ providedIn: 'root' })
export class DesignationService {

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0);

  constructor(private httpService: HttpService) { }

  // =========================
  // Get  list All designations
  // =========================
  getListAll(level?: DesignationLevelEnum): Observable<DesignationResponseModel[]> {
    const query = {
      level: level
    };
    return this.httpService
      .get<DesignationResponseModel[]>(API_ENDPOINTS.Designations.GetListLookup, query)
      .pipe(
        tap((response) => {
          console.log('Fetched designations:', response);
        })
      );
  }

  // =========================
  // Get  list All designations
  // =========================
  getListAllWithCount(level?: DesignationLevelEnum): Observable<DesignationWithCountResponseModel[]> {
    const query = {
      level: level
    };
    return this.httpService
      .get<DesignationWithCountResponseModel[]>(API_ENDPOINTS.Designations.GetListLookupWithCount, query)
      .pipe(
        tap((response) => {
          console.log('Fetched designations:', response);
        })
      );
  }


  // =========================
  // Get paged list of designations
  // =========================
  getList(params?: GetDesignationListQuery): Observable<PagedResult<DesignationResponseModel>> {
    const query: GetDesignationListQuery = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
      level: params?.level
    };

    return this.httpService
      .get<PagedResult<DesignationResponseModel>>(API_ENDPOINTS.Designations.GetList, query)
      .pipe(
        tap((response) => {
          this.pageNumber.set(response.pageNumber);
          this.pageSize.set(response.pageSize);
          this.orderByLatest.set(response.orderByLatest);
          this.totalPages.set(response.totalPages);
          this.totalCount.set(response.totalCount);
          console.log('Fetched designations:', response);
        })
      );
  }


  // =========================
  // Get designation by ID
  // =========================
  getById(id: string): Observable<DesignationResponseModel> {
    return this.httpService
      .get<DesignationResponseModel>(API_ENDPOINTS.Designations.GetById(id))
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Create designation
  // =========================
  create(request: CreateDesignationRequestModel): Observable<DesignationResponseModel> {
    return this.httpService
      .post<DesignationResponseModel>(API_ENDPOINTS.Designations.Create, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Update designation
  // =========================
  update(request: UpdateDesignationRequestModel): Observable<DesignationResponseModel> {
    return this.httpService
      .put<DesignationResponseModel>(API_ENDPOINTS.Designations.Update, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }

  // =========================
  // Toggle isActive / archive
  // =========================
  toggleActive(request: ArchiveDesignationRequestModel): Observable<DesignationResponseModel> {
    return this.httpService
      .patch<DesignationResponseModel>(API_ENDPOINTS.Designations.ToggleIsActive, request)
      .pipe(
        tap(() => {
          // optional side effects
        })
      );
  }
}
