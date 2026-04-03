// Angular import
import { Location } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import
import { AdminAsideItems, AsideItem, EmployeeAsideItems } from '../aside';

import { RoleNameEnum } from '../../../core/enums/role.enum';
import { AuthService } from '../../../core/services/infrastructure/auth.service';
import { SharedModule } from '../../../shared/shared.module';
import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavItemComponent } from './nav-item/nav-item.component';

@Component({
    selector: 'app-aside-content',
    imports: [RouterModule, NavCollapseComponent, NavGroupComponent, NavItemComponent, SharedModule],
    templateUrl: './aside-content.component.html',
    styleUrl: './aside-content.component.scss'
})
export class AsideContentComponent implements OnInit {
    private location = inject(Location);

    // public props
    NavCollapsedMob = output();
    SubmenuCollapse = output();

    navigations!: AsideItem[];
    windowWidth: number;
    role: RoleNameEnum | null = null;

    // Constructor
    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        this.windowWidth = window.innerWidth;
    }

    // Life cycle events
    ngOnInit() {
        this.loadCurrentUserRoles()
        if (this.windowWidth < 1025) {
            setTimeout(() => {
                (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
            }, 500);
        }
    }

    loadCurrentUserRoles() {
        this.role = this.authService.getUserRole();
        if (!this.role) {
            this.router.navigate(['/']);
        }

        // 1. Load the correct navigation list based on the user role
        if (this.role === RoleNameEnum.Admin) {
            this.navigations = AdminAsideItems;
        }
        else if (this.role === RoleNameEnum.Employee) {
            this.navigations = EmployeeAsideItems;
        }

        // 2. IMPORTANT FIX: Call fireOutClick AFTER the menu list is loaded.
        // The setTimeout ensures Angular has time to render the HTML elements 
        // before fireOutClick tries to find them in the DOM.
        setTimeout(() => {
            this.fireOutClick();
        }, 100);
    }

    fireOutClick() {
        let current_url = this.location.path();
        // eslint-disable-next-line
        // @ts-ignore
        if (this.location['_baseHref']) {
            // eslint-disable-next-line
            // @ts-ignore
            current_url = this.location['_baseHref'] + this.location.path();
        }
        const link = "a.nav-link[ href='" + current_url + "' ]";
        const ele = document.querySelector(link);
        if (ele !== null && ele !== undefined) {
            const parent = ele.parentElement;
            const up_parent = parent?.parentElement?.parentElement;
            const last_parent = up_parent?.parentElement;
            if (parent?.classList.contains('coded-hasmenu')) {
                parent.classList.add('coded-trigger');
                parent.classList.add('active');
            } else if (up_parent?.classList.contains('coded-hasmenu')) {
                up_parent.classList.add('coded-trigger');
                up_parent.classList.add('active');
            } else if (last_parent?.classList.contains('coded-hasmenu')) {
                last_parent.classList.add('coded-trigger');
                last_parent.classList.add('active');
            }
        }
    }
}