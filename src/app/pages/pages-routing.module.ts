import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ServerErrorComponent } from './server-error/server-error.component';

const routes: Routes = [
  { path: '', component: NotFoundComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'session-expired', component: SessionExpiredComponent },
  { path: 'forbidden', component: UnauthorizedComponent },
  { path: 'server-error', component: ServerErrorComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
