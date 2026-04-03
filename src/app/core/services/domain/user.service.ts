import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { UserResponseModel } from '../../models/user/user-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {
  }

  getMyInfo(): Observable<UserResponseModel> {
    return this.http.get<UserResponseModel>(API_ENDPOINTS.Account.GetMyInfo).pipe(
      tap((response: UserResponseModel) => {

      })
    );
  }


}