import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/infrastructure/auth.service';
import { RoleNameEnum } from '../../core/enums/role.enum';

@Injectable({ providedIn: 'root' })
export class RedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getUserRole();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
console.log("RedirectGuard: User role is", role);
    if (role === RoleNameEnum.Admin) {
      this.router.navigate(['/admin']);
    }
    else if (role === RoleNameEnum.Employee) {
      this.router.navigate(['/employee']);
    } else {
      this.router.navigate(['/auth/login']);
    }

    return false; // navigation already handled
  }
}
