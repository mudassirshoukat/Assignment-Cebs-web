import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule, LocationStrategy ,Location} from '@angular/common';
import { UIConfig } from '../../app.config';
import { TenantService } from '../../core/services/domain/tenant.service';
import { Observable } from 'rxjs';
import { TenantResponse } from '../../core/models/tenant/tenant-response.model';
import { AsideComponent } from "../aside/aside.component";


@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, NavBarComponent, CommonModule, NavBarComponent, RouterModule, AsideComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit ,OnInit{
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  cdr = inject(ChangeDetectorRef);

  // public props
  currentLayout!: string;
  navCollapsed = true;
  navCollapsedMob = false;
  windowWidth!: number;

  constructor(private tenantService:TenantService){}
     ngOnInit(): void {
    
    // this.tenantService.GetCurrentTenant().subscribe({
    //   next: (tenant) => console.log('Tenant data loaded for session'),
    //   error: (err) => console.error('Failed to load tenant data', err)
    // });
    this.tenantService.setTenant();
    console.log( "tenant data from main-layout",this.tenantService.currentTenant$);

  }
  
  ngAfterViewInit() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    if (current_url === baseHref + '/layout/theme-compact' || current_url === baseHref + '/layout/box') {
      UIConfig.isCollapse_menu = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? UIConfig.isCollapse_menu : false;
    this.cdr.detectChanges();
  }

  // private method
  private isThemeLayout(layout: string) {
    this.currentLayout = layout;
  }

  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
    if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('navbar-collapsed')) {
      document.querySelector('app-navigation.pc-sidebar')?.classList.remove('navbar-collapsed');
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pc-sidebar')?.classList.remove('mob-open');
    }
  }
}