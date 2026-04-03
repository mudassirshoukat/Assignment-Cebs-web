import { Routes } from '@angular/router';
import { RoleNameEnum } from './core/enums/role.enum';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './shared/guards/AuthGaurd';
import { RedirectGuard } from './shared/guards/RedirectGuard';
import { RoleGuard } from './shared/guards/RoleGuard';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      {
        path: '',
        canActivate: [RedirectGuard],
        loadChildren: () =>
          import('./main/landing/landing.module').then((m) => m.LandingModule),
      },
      {
        path: 'employee',
        canActivate: [RoleGuard],
        data: { roles: [RoleNameEnum.Employee] },
        loadChildren: () =>
          import('./main/employee/employee.module').then((m) => m.EmployeeModule),
      },

      {
        path: 'admin',
        canActivate: [RoleGuard],
        data: { roles: [RoleNameEnum.Admin] },
        loadChildren: () =>
          import('./main/admin/admin.module').then((m) => m.AdminModule),
      }


    ],
  },

  { path: 'page', loadChildren: () => import('./pages/pages-routing.module').then(m => m.PagesRoutingModule) },
  { path: '**', redirectTo: 'auth/login' },
];
