import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalDialogComponent } from './shared/components/global-dialog/global-dialog.component';
import { DialogService } from './shared/services/dialog.service';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Toast } from "primeng/toast";
import { NotificationHubService } from './core/realtime/notification-hub.service';
import { AuthService } from './core/services/infrastructure/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, GlobalDialogComponent, NgIf, AsyncPipe, Toast]
})
export class AppComponent {
  constructor(
    public dialogService: DialogService,  
       private hubService: NotificationHubService,
       private authService: AuthService
) {}

 ngOnInit(): void {
    const token = this.authService.getToken();

    if (token) {
      this.hubService.startConnection(token);
    }
  }
}
