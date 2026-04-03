import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { RoleEnum } from '../../enums/role.enum';
import { PagedResult } from '../../models/_pagination/paged-result-response.model';
import { PaginationParamsRequest } from '../../models/_pagination/pagination-params-request.model';
import { EmployeeResponseModel } from '../../models/employee/employee-response.model';
import { HttpService } from '../infrastructure/http.service';
import { EmployeeWithTitlesResponseModel } from '../../models/employee/employee-with-titles-response.model';
import { GetEmployeeListQuery } from '../../models/employee/request/employee-list-query.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0); // optional if you want to persist total pages

  constructor(private httpService: HttpService) { }

  getList(
    params?: PaginationParamsRequest,
  ): Observable<PagedResult<EmployeeResponseModel>> {
    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
    };
    const res = this.httpService.get<PagedResult<EmployeeResponseModel>>(
      API_ENDPOINTS.Employees.GetList,
      query,
    );
    return res.pipe(
      tap((response: PagedResult<EmployeeResponseModel>) => {
        this.pageNumber.set(response.pageNumber);
        this.pageSize.set(response.pageSize);
        this.orderByLatest.set(response.orderByLatest);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        console.log('Fetched employees:', response);
      }),
    );
  }

    getWithTitlesList(params?: GetEmployeeListQuery): Observable<PagedResult<EmployeeWithTitlesResponseModel>> {
    const query: GetEmployeeListQuery = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
      departmentId:params?.departmentId??undefined,
      designationId:params?.designationId??undefined,
      jobTitle:params?.jobTitle??undefined,
      isOrphen:params?.isOrphen??undefined,
    };
    const res = this.httpService.get<PagedResult<EmployeeWithTitlesResponseModel>>(
      API_ENDPOINTS.Employees.GetWithTitlesList,
      query,
    );
    return res.pipe(
      tap((response: PagedResult<EmployeeWithTitlesResponseModel>) => {
        this.pageNumber.set(response.pageNumber);
        this.pageSize.set(response.pageSize);
        this.orderByLatest.set(response.orderByLatest);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        console.log('Fetched employees with titles:', response);
      }),
    );
  }


  getListAll(roleEnum?: RoleEnum): Observable<EmployeeResponseModel[]> {
    const res = this.httpService.get<EmployeeResponseModel[]>(
      API_ENDPOINTS.Employees.GetListAll,
    );
    return res.pipe(
      tap((response: EmployeeResponseModel[]) => {
        console.log('Fetched employees:', response);
      }),
    );
  }
}
