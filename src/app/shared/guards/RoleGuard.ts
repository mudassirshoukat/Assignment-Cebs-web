import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../core/services/infrastructure/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const allowedRoles: string[] = route.data['roles'] || [];
    const userRole = this.authService.getUserRole();
    console.log("RoleGuard: Retrieved user role is", userRole);
    console.log("RoleGuard: Allowed roles are", allowedRoles);

    if (!allowedRoles.length || (userRole && allowedRoles.includes(userRole))) {

      console.log("RoleGuard: Access granted");

      return true;
    }

    console.log("RoleGuard: Access denied");

    this.router.navigate(['/auth/login']);
    return false;
  }
}