import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MessageService, SharedModule } from 'primeng/api'; // Still needed for success messages
import { InvitationService } from '../../core/services/domain/invitation.service';
import { AcceptInvitationRequestModel } from '../../core/models/invitation/accept-invitation-request.model';
import { InputTextModule } from 'primeng/inputtext';
import { passwordMatchValidator } from '../register/register.component'; // Assuming this function is correctly imported
import { finalize } from 'rxjs';
import { InvitationResponse } from '../../core/models/invitation/invitation-response.model';
import { DialogService } from '../../shared/services/dialog.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../core/services/infrastructure/auth.service';

@Component({
  selector: 'app-accept-invitation',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, SharedModule],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.scss',
   animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
                style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AcceptInvitationComponent implements OnInit {
  inviteForm!: FormGroup;
  isLoading = true; // Start loading to wait for token check and API call
  invitationToken: string | null = null;
  invitation: InvitationResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private inviteService: InvitationService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private authservice: AuthService,
    private route: ActivatedRoute,
  ) { }

  // accept-invitation.component.ts

// The order should be: Initialize Form -> Check Token -> Load Data

ngOnInit(): void {
    // 1. MUST BE FIRST: Initialize Form Structure
    this.initializeForm();

    // 2. Read Token
    this.invitationToken = this.route.snapshot.queryParamMap.get('token'); 

    if (!this.invitationToken) {
        // Handle error and redirect, but the form exists now.
        this.dialogService.showError('Invalid invitation link.', 'Missing Token');
        this.router.navigate(['/']); 
        return; 
    }

    // 3. Load Data (If token is valid)
    this.loadInvitation();
}
  get f() {
    return this.inviteForm.controls;
  }

  private initializeForm(): void {
    this.inviteForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]], // Regex refined
        lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]], // Regex refined
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, Validators.requiredTrue]
      },
      { validators: passwordMatchValidator } // Assumed validator for 'password' and 'confirmPassword'
    );
  }

  loadInvitation() {
    // isLoading is true from the start
    this.inviteService.getByToken(this.invitationToken!)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: InvitationResponse) => {
          this.invitation = response;

          // Patch form if data is available (e.g., if you pre-fill name from invitation)
          // For now, only email is known, but names are user-provided.
          // If you want to use the email for display, you can:
          // this.inviteForm.patchValue({ email: response.email });
        },
        error: (error) => {
          // 💡 ERROR CORRECTION: If the token API fails (e.g., expired/invalid token)
          // The global interceptor shows the error message, but we still need to redirect locally.
          this.router.navigate(['/auth/login']);
        },
      });
  }

  onSubmit(): void {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.inviteForm.getRawValue();

    const acceptinviteRequest: AcceptInvitationRequestModel = {
      token: this.invitationToken!,
      password: formValue.password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
    };

    this.inviteService.acceptInvite(acceptinviteRequest)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account created successfully!' });
          this.authservice.logout(); //making sure user goes to login page not redirected to dashboard with existing token
          this.router.navigate(['/']);
        },
        error: (err) => {
          // 💡 GLOBAL INTERCEPTOR HANDLES UI MESSAGE. 
          // We only need finalize() to reset isLoading.
        },
      });
  }
}