import { Component, OnInit, } from '@angular/core';

import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/domain/user.service';


@Component({
    selector: 'app-manager-dashboard',
    imports: [CommonModule],
    templateUrl: './employee-dashboard.component.html',
    styleUrl: './employee-dashboard.component.scss'
})
    export class EmployeeDashboardComponent implements OnInit {
isLoading = false;
  apiResponse: any = null;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    console.log('Admin Dashboard Loaded');
  }
 testApiHit(): void {
    this.isLoading = true;
    this.apiResponse = null; // reset previous response
    console.log('API Hit Test from Admin Dashboard');

    this.userService.getMyInfo().subscribe({
      next: (response) => {
        console.log('User Info:', response);
        this.apiResponse = response; // store API response
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user info:', error);
        this.apiResponse = { error: error.message || error };
        this.isLoading = false;
      },
    });
  }
}
