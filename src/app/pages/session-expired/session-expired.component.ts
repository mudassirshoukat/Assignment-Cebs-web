import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../core/services/infrastructure/auth.service';

@Component({
  selector: 'app-session-expired',
  imports: [ButtonModule, RouterModule, RippleModule, ButtonModule],
  templateUrl: './session-expired.component.html',
  styleUrl: './session-expired.component.scss'
})
export class SessionExpiredComponent  { 
  constructor(private authService: AuthService) {}
signOut() {
    this.authService.logout ();
}

}
