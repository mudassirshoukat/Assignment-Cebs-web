// Angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/infrastructure/auth.service';

// third party import

@Component({
    selector: 'app-nav-notification',
    imports: [RouterModule, SharedModule],
    templateUrl: './app-nav-notification.component.html',
    styleUrls: ['./app-nav-notification.component.scss']
})
export class NavNotificationComponent {
    constructor(private authService: AuthService) { }

    logout(): void {
        this.authService.logout();
        window.location.reload();
    }
}

