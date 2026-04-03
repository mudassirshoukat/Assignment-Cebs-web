import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { RegisterUserRequestModel } from '../../models/account/register-user-request.model';
import { UserResponseModel } from '../../models/user/user-response.model';
import { HttpService } from '../infrastructure/http.service';
import { TenantResponse } from '../../models/tenant/tenant-response.model';
import { CreateTenantRequestModel } from '../../models/tenant/tenant-register-request.model';


@Injectable({ providedIn: 'root' })
export class TenantService {
  private currentTenantSubject = new BehaviorSubject<TenantResponse | null>(null);

  // 2. A public observable for components to subscribe to
  public currentTenant$ = this.currentTenantSubject.asObservable();

  constructor(private httpService: HttpService) {
  }


  GetCurrentTenant(): Observable<TenantResponse> {
    return this.httpService.get<TenantResponse>(API_ENDPOINTS.Tenants.GetCurrent).pipe(
      tap((response: TenantResponse) => {
        this.currentTenantSubject.next(response);
      })
    );
  }


  CreateTenant(request: CreateTenantRequestModel): Observable<TenantResponse> {
    return this.httpService.post<TenantResponse>(API_ENDPOINTS.Tenants.Create, request).pipe(
      tap((response: TenantResponse) => {
      })
    );
  }

}