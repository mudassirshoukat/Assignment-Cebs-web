import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { RoleNameEnum } from '../../enums/role.enum';
import { CurrentUserModel } from '../../models/account/current-user.model';
import { JwtPayloadModel } from '../../models/account/jwt-payload.model';
import { LoginRequestModel } from '../../models/account/login-request.model';
import { LoginResponseModel } from '../../models/account/login-response.model';
import { RegisterUserRequestModel } from '../../models/account/register-user-request.model';
import { UserResponseModel } from '../../models/user/user-response.model';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';



// ⬅️ Import the new interfaces

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use the CurrentUser interface for type safety
  private currentUserSubject = new BehaviorSubject<CurrentUserModel | null>(null);
  public currentUser$: Observable<CurrentUserModel | null> = this.currentUserSubject.asObservable();

  // The specific URI key for the role claim in your JWT
  private readonly ROLE_CLAIM_URI = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  constructor(private httpService: HttpService, private storageService: StorageService) {
    this.loadUserFromStorage();
  }

  // --- Token Management and Initialization ---

  private loadUserFromStorage() {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      const user = this.decodeToken(token);
      // Check for null just in case decoding failed
      if (user) {
        this.currentUserSubject.next(user);
      }
    }
  }

  getToken(): string | null {
    return this.storageService.getItem(this.storageService.KEYS.AUTH_TOKEN);
  }

  setToken(token: string) {
    this.storageService.setItem(this.storageService.KEYS.AUTH_TOKEN, token);
    const user = this.decodeToken(token);
    this.currentUserSubject.next(user);
  }

  removeToken() {
    this.storageService.removeItem(this.storageService.KEYS.AUTH_TOKEN);
    this.currentUserSubject.next(null);
    console.log("AuthService: Token removed, user logged out.");
  }

  // --- Authentication Status & User Info ---

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Re-enabled proper check
        console.log("AuthService: Checking authentication status.", !!token && this.isTokenValid(token));

    return !!token && this.isTokenValid(token);
  }

  // Type-safe way to get the role
  getUserRole(): RoleNameEnum | null {
    const user = this.currentUserSubject.value;
    // The role is now a simple property on the CurrentUser object
    console.log("AuthService: Getting user role.", user?.role);
    return user?.role || null;
  }

  // Type-safe way to get the current user
  getCurrentUser(): CurrentUserModel | null {
    return this.currentUserSubject.value;
  }

  // --- JWT Handling (Your focus area) ---

  private isTokenValid(token: string): boolean {
    try {
      // Decode the payload and assert its type
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayloadModel;
      const exp = payload.exp;
      // Convert expiration (seconds) to milliseconds
      return !exp || (exp * 1000) > Date.now();
    } catch {
      return false;
    }
  }

  // 🎯 KEY CHANGE: Correctly decodes and maps the verbose claim to a simple 'role'
  private decodeToken(token: string): CurrentUserModel | null {
    try {
      const payloadString = atob(token.split('.')[1]);
      const payload = JSON.parse(payloadString) as JwtPayloadModel;
      console.log('Decoded JWT Payload:', payload);

      const roleString = payload[this.ROLE_CLAIM_URI];
      const user: CurrentUserModel = {
        userId: payload.sub,
        email: payload.email,
        // ⬅️ This is the critical change: accessing the property using the long string
        role: roleString as RoleNameEnum
      };

      return user;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // --- API Calls ---

  login(loginRequest: LoginRequestModel): Observable<LoginResponseModel> {
    return this.httpService.post<LoginResponseModel>(API_ENDPOINTS.Account.LOGIN, loginRequest).pipe(
      tap((response: LoginResponseModel) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }


  register(registerRequest: RegisterUserRequestModel): Observable<UserResponseModel> {
    return this.httpService.post<UserResponseModel>(API_ENDPOINTS.Account.REGISTER, registerRequest).pipe(
      tap((response: UserResponseModel) => {
        console.log('Registration successful:', response);
      })
    );
  }



  logout() {
    this.removeToken();
  }
}