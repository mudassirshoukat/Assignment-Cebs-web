import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { finalize } from 'rxjs/operators'; // For modern pipe usage

// --- Primeng Imports (Keep all original ones) ---
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

// --- Feature Imports (UPDATED) ---
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { PagedResult } from '../../../core/models/_pagination/paged-result-response.model';
import { DepartmentResponseModel } from '../../../core/models/department/department-response.model';
import { DepartmentService } from '../../../core/services/domain/department.service';
import { DepartmentCreateDialogComponent } from "./department-create-dialog/department-create-dialog.component";
import { DepartmentUpdateDialogComponent } from "./department-update-dialog/department-update-dialog.component";
import { JobTitleCreateDialogComponent } from "../job-title-management/job-title-create-dialog/job-title-create-dialog.component";


@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    Card,
    MenuModule,
    SplitButtonModule,
    DepartmentCreateDialogComponent,
    DepartmentUpdateDialogComponent
  ],
  templateUrl: './department-management.component.html',
  styleUrl: './department-management.component.scss'
})

export class DepartmentManagementComponent implements OnInit {


  // --- State Signals (Modern Angular) ---

  departments = signal<DepartmentResponseModel[]>([]);
  isLoading = signal(false);
  selectedDepartments = signal<DepartmentResponseModel[] | null>(null);

  // --- Dialog Management State ---
  isCreateDialogOpen = signal(false);
  isUpdateDialogOpen = signal(false);
  selectedDepartmentToEdit = signal<DepartmentResponseModel | null>(null);

  @ViewChild('dt') dt!: Table;



  constructor(
    public departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadDepartments();
  }

  onPageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1; // correct page number
    this.departmentService.pageNumber.set(pageNumber);
    this.departmentService.pageSize.set(event.rows);

    this.loadDepartments();
  }

  loadDepartments() {
    this.isLoading.set(true);

    this.departmentService
      .getDepartments()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: PagedResult<DepartmentResponseModel>) => {
          this.departments.set(response.items);
          console.log('Total Count:', this.departmentService.totalCount());
          console.log('Page Number:', this.departmentService.pageNumber());
        },
        error: (error) => {
          console.error('Error fetching departments:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load departments.',
            life: 3000,
          });
        },
      });
  }




  openNew() {
    this.isCreateDialogOpen.set(true);
  }

  onDepartmentCreated() {
    this.loadDepartments(); // Refresh the list
  }

  editDepartment(department: DepartmentResponseModel) {
    this.selectedDepartmentToEdit.set(department);
    this.isUpdateDialogOpen.set(true);
  }

  // --- Dialog Event Handlers ---


  onDepartmentUpdated() {
    this.loadDepartments(); // Refresh the list
  }

  onUpdateDialogHide() {
    this.isUpdateDialogOpen.set(false);
    this.selectedDepartmentToEdit.set(null);
  }

  // --- Utility Methods ---

  onGlobalFilter(table: Table, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }


  viewDepartmentDetails(department: DepartmentResponseModel): void {
    this.router.navigate(['/admin/departments', department.id, 'details']);
  }

}
