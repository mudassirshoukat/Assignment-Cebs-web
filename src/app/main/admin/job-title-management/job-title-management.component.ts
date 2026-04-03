import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { finalize } from 'rxjs';

import { JobTitleService } from '../../../core/services/domain/job-title.service';
import { DepartmentService } from '../../../core/services/domain/department.service';

import { JobTitleResponseModel } from '../../../core/models/job-title/job-title-response.model';
import { DepartmentResponseModel } from '../../../core/models/department/department-response.model';
import { PagedResult } from '../../../core/models/_pagination/paged-result-response.model';
import { GetJobTitleListQuery } from '../../../core/models/job-title/request/job-title-list-query.model';

import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { JobTitleCreateDialogComponent } from './job-title-create-dialog/job-title-create-dialog.component';
import { JobTitleUpdateDialogComponent } from './job-title-update-dialog/job-title-update-dialog.component';

@Component({
  selector: 'app-job-title-management',
  standalone: true,
  imports: [
    TableModule,
    Card,
    DropdownModule,
    CommonModule,
    TooltipModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    TagModule,
    JobTitleCreateDialogComponent,
    JobTitleUpdateDialogComponent
  ],
  templateUrl: './job-title-management.component.html',
  styleUrl: './job-title-management.component.scss'
})
export class JobTitleManagementComponent implements OnInit {

  // -------------------- State --------------------

  jobtitles = signal<JobTitleResponseModel[]>([]);
  isLoading = signal(false);

  // Dialog state
  isCreateDialogOpen = signal(false);
  isUpdateDialogOpen = signal(false);
  selectedJobTitleToEdit = signal<JobTitleResponseModel | null>(null);

  // Filters
  departmentsForFilter: DepartmentResponseModel[] = [];
  selectedDepartmentFilter: string | null = null;

  @ViewChild('dt') dt!: Table;

  constructor(
    public jobtitleService: JobTitleService,
    public departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router
  ) { }

  // -------------------- Lifecycle --------------------

ngOnInit(): void {
  this.loadDepartments();
}

  // -------------------- Data Loading --------------------

  loadDepartments(): void {
  this.isLoading.set(true);

  this.departmentService.getLookup()
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: (response: DepartmentResponseModel[]) => {
        this.departmentsForFilter = response;

        if (response.length > 0) {
          this.selectedDepartmentFilter = response[0].id;

          // ✅ NOW departmentId exists
          this.loadJobTitles();
        }
      },
      error: (err) => console.error(err)
    });
}

  loadJobTitles(): void {
    this.isLoading.set(true);
    if (!this.selectedDepartmentFilter)
    { this.isLoading.set(false)
      console.log("Job titles never fetched")
      return
    }
      
    const query: GetJobTitleListQuery = {
      departmentId: this.selectedDepartmentFilter!
    };

    this.jobtitleService
      .getJobTitles(query)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: PagedResult<JobTitleResponseModel>) => {
          this.jobtitles.set(response.items);
          this.jobtitleService.totalCount.set(response.totalCount);
        },
        error: (err) => {
          console.error('Error loading job titles', err);
        }
      });
  }

  // -------------------- Table Events --------------------

  onPageChange(event: any): void {
    const pageNumber = Math.floor(event.first / event.rows) + 1;
    this.jobtitleService.pageNumber.set(pageNumber);
    this.jobtitleService.pageSize.set(event.rows);
    this.loadJobTitles();
  }

  onDepartmentFilterChange(): void {
    this.jobtitleService.pageNumber.set(1);
    this.loadJobTitles();
  }

  // -------------------- Dialog Actions --------------------

  openNew(): void {
    this.isCreateDialogOpen.set(true);
  }

  editJobTitle(jobtitle: JobTitleResponseModel): void {
    this.selectedJobTitleToEdit.set(jobtitle);
    this.isUpdateDialogOpen.set(true);
  }

  onJobTitleCreated(): void {
    this.loadJobTitles();
  }

  onJobTitleUpdated(): void {
    this.loadJobTitles();
  }

  onUpdateDialogHide(): void {
    this.isUpdateDialogOpen.set(false);
    this.selectedJobTitleToEdit.set(null);
  }

  // -------------------- Navigation --------------------

  viewJobTitleDetails(jobtitle: JobTitleResponseModel): void {
    this.router.navigate(['/admin/job-titles', jobtitle.id, 'details']);
  }
}
