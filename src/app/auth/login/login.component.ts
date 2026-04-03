import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/infrastructure/auth.service';
import { LoginRequestModel } from '../../core/models/account/login-request.model';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    // 3. Initialize the form structure
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }


  onSubmit(): void {
    // Prevent submission if the form is invalid
    if (this.loginForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Cast the form value to the expected request model
    const loginRequest: LoginRequestModel = this.loginForm.value as LoginRequestModel;

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
        // Navigate to the home page or dashboard after successful login
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}