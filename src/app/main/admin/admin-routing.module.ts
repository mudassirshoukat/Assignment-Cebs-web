import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { InviteManagementComponent } from './invite-management/invite-management.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TeamManagementComponent } from './team-management/team-management.component';
import { TeamDetailComponent } from './team-management/team-detail/team-detail.component';
import { ProjectDetailComponent } from './project-management/project-detail/project-detail.component';
import { ProjectDetailDemoComponent } from './project-management/project-detail-demo/project-detail-demo.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';
import { DepartmentDetailComponent } from './department-management/department-detail/department-detail.component';
import { JobTitleManagementComponent } from './job-title-management/job-title-management.component';
import { DesignationManagementComponent } from './designation-management/designation-management.component';
import { DesignationDetailComponent } from './designation-management/designation-detail/designation-detail.component';
import { DesignationDemoComponent } from './designation-management/designation-demo/designation-demo.component';
import { DepartmentDetailDemoComponent } from './department-management/department-detail-demo/department-detail-demo.component';
import { JobTitleDetailComponent } from './job-title-management/job-title-detail/job-title-detail.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { EmployeeHierarchyComponent } from './employee-management/employee-hierarchy/employee-hierarchy.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'dashboard', component: AdminDashboardComponent },

  { path: 'invites', component: InviteManagementComponent },
  { path: 'employees', component: EmployeeManagementComponent },
  { path: 'employee-hierarchy', component: EmployeeHierarchyComponent },

  { path: 'projects', component: ProjectManagementComponent },
  { path: 'projects/:id/details', component: ProjectDetailComponent },
  { path: 'projects/:id/demo-details', component: ProjectDetailDemoComponent },

  { path: 'teams', component: TeamManagementComponent },
  { path: 'teams/:id/details', component: TeamDetailComponent },
  { path: 'teams/:id/demo-details', component: TeamDetailComponent },

  { path: 'departments', component: DepartmentManagementComponent },
  { path: 'departments/:id/details', component: DepartmentDetailComponent },
  { path: 'departments/:id/demo-details', component: DepartmentDetailDemoComponent },

  { path: 'job-titles', component: JobTitleManagementComponent },
  { path: 'job-titles/:id/details', component: JobTitleDetailComponent },

  { path: 'designations', component: DesignationManagementComponent },
  { path: 'designations/:id/details', component: DesignationDetailComponent },
  { path: 'designations-demo', component: DesignationDemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
