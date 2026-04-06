import { Observable, tap } from "rxjs";
import { API_ENDPOINTS } from "../../constants/api-endpoints";
import { OrderResponseModel } from "../../models/order/order-response.model";
import { UpdateOrderStatusRequestModel } from "../../models/order/requests/update-order-status-request.model";
import { CreateOrderRequestModel } from "../../models/order/requests/create-order-request.model";
import { PaginationParamsRequest } from "../../models/_pagination/pagination-params-request.model";
import { PagedResult } from "../../models/_pagination/paged-result-response.model";
import { Injectable, signal } from "@angular/core";
import { HttpService } from "../infrastructure/http.service";

@Injectable({ providedIn: 'root' })
export class OrderService {
  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  orderByLatest = signal(false);
  totalCount = signal(0); // optional if you want to persist total pages

  constructor(private httpService: HttpService) { }
 
  // for admin dashboard - list of orders with pagination
  getOrders(
    params?: PaginationParamsRequest,
  ): Observable<PagedResult<OrderResponseModel>> {
    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
    };
    const res = this.httpService.get<PagedResult<OrderResponseModel>>(
      API_ENDPOINTS.Orders.GetList,
      query,
    );
    return res.pipe(
      tap((response: PagedResult<OrderResponseModel>) => {
        this.pageNumber.set(response.pageNumber);
        this.pageSize.set(response.pageSize);
        this.orderByLatest.set(response.orderByLatest);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        console.log('Fetched orders:', response);
      }),
    );
  }

   // for Customer dashboard - list of orders with pagination
  getMyOrders(
    params?: PaginationParamsRequest,
  ): Observable<PagedResult<OrderResponseModel>> {
    const query: PaginationParamsRequest = {
      pageNumber: params?.pageNumber ?? this.pageNumber(),
      pageSize: params?.pageSize ?? this.pageSize(),
      orderByLatest: params?.orderByLatest ?? this.orderByLatest(),
    };
    const res = this.httpService.get<PagedResult<OrderResponseModel>>(
      API_ENDPOINTS.Orders.GetMyOrders,
      query,
    );
    return res.pipe(
      tap((response: PagedResult<OrderResponseModel>) => {
        this.pageNumber.set(response.pageNumber);
        this.pageSize.set(response.pageSize);
        this.orderByLatest.set(response.orderByLatest);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        console.log('Fetched orders:', response);
      }),
    );
  }

  getById(id: string): Observable<OrderResponseModel> {
    return this.httpService
      .get<OrderResponseModel>(API_ENDPOINTS.Orders.GetById(id))
      .pipe(tap((response: OrderResponseModel) => { }));
  }

  
  create(request: CreateOrderRequestModel): Observable<OrderResponseModel> {
    return this.httpService
      .post<OrderResponseModel>(API_ENDPOINTS.Orders.Create, request)
      .pipe(tap((response: OrderResponseModel) => { }));
  }

  update(request: UpdateOrderStatusRequestModel): Observable<OrderResponseModel> {
    return this.httpService
      .put<OrderResponseModel>(API_ENDPOINTS.Orders.Update, request)
      .pipe(tap((response: OrderResponseModel) => { }));
  }

}
