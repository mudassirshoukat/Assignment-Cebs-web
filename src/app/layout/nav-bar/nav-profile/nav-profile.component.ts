// Angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/infrastructure/auth.service';

// third party import

@Component({
    selector: 'app-nav-profile',
    imports: [RouterModule, SharedModule],
    templateUrl: './nav-profile.component.html',
    styleUrls: ['./nav-profile.component.scss']
})
export class NavProfileComponent {
    constructor(private authService: AuthService) { }

    logout(): void {
        this.authService.logout();
        window.location.reload();
    }
}

