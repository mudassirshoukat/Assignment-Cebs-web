// Angular import
import { Component, output } from '@angular/core';

// project import
import { NavLogoComponent } from './nav-logo/nav-logo.component';
import { NavProfileComponent } from './nav-profile/nav-profile.component';
import { UIConfig } from '../../app.config';
import { NavNotificationComponent } from "./nav-notification/app-nav-notification.component";
import { Observable } from 'rxjs';
import { TenantResponse } from '../../core/models/tenant/tenant-response.model';
import { TenantService } from '../../core/services/domain/tenant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, NavLogoComponent, NavProfileComponent, NavNotificationComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  // public props
  NavCollapse = output();
  NavCollapsedMob = output();
  navCollapsed: boolean;
  windowWidth: number;
  navCollapsedMob: boolean;
  tenant$!: Observable<TenantResponse | null>;

  // Constructor
  constructor(private tenantService: TenantService) {
    this.tenant$ = this.tenantService.currentTenant$;
    console.log("Tenant data from navbar",this.tenant$);
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? UIConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  // public method
  navCollapse() {
    if (this.windowWidth >= 1025) {
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
  }

  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }
}
