
const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'dashboard', component: AdminDashboardComponent },


  { path: 'departments', component: DepartmentManagementComponent },
  { path: 'departments/:id/details', component: DepartmentDetailComponent },
  { path: 'departments/:id/demo-details', component: DepartmentDetailDemoComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
