import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AcceptInvitationComponent } from './accept-invitation/accept-invitation.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
   { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'accept-invite', component: AcceptInvitationComponent },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
