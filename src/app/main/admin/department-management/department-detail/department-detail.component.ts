import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// If you're using RouterLink in breadcrumb
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepartmentResponseModel } from '../../../../core/models/department/department-response.model';
import { JobTitleResponseModel } from '../../../../core/models/job-title/job-title-response.model';
import { JobTitleWithEmployeeCountResponseModel } from '../../../../core/models/job-title/job-title-with-employee-count-response.model';
import { EmployeeResponseModel } from '../../../../core/models/employee/employee-response.model';
import { DepartmentService } from '../../../../core/services/domain/department.service';
import { JobTitleService } from '../../../../core/services/domain/job-title.service';
import { EmployeeService } from '../../../../core/services/domain/employee.service';
import { DesignationService } from '../../../../core/services/domain/designation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DesignationResponseModel } from '../../../../core/models/designation/designation-response.model';
import { GetJobTitleListQuery } from '../../../../core/models/job-title/request/job-title-list-query.model';
import { finalize } from 'rxjs';
import { PagedResult } from '../../../../core/models/_pagination/paged-result-response.model';
import { GetEmployeeListQuery } from '../../../../core/models/employee/request/employee-list-query.model';
import { AppDatePipe } from "../../../../shared/pipes/app-date.pipe";
import { AppTimeAgoPipe } from "../../../../shared/pipes/app-time-ago.pipe";
import { JobTitleCreateDialogComponent } from "../../job-title-management/job-title-create-dialog/job-title-create-dialog.component";
import { ConfirmDialog } from "primeng/confirmdialog";
import { DepartmentCreateDialogComponent } from "../department-create-dialog/department-create-dialog.component";
import { DepartmentUpdateDialogComponent } from "../department-update-dialog/department-update-dialog.component";
import { DepartmentDetailResponseModel } from '../../../../core/models/department/department-detail-response.model';
import { EmployeeWithTitlesResponseModel } from '../../../../core/models/employee/employee-with-titles-response.model';
import { InitialsPipe } from "../../../../shared/pipes/initials.pipe";
@Component({
  selector: 'app-department-detail',
  imports: [
    // Angular Common
    CommonModule,
    FormsModule,
    RouterModule, // Only if using routerLink in breadcrumb
    // PrimeNG Modules
    CardModule,
    TabViewModule,
    TagModule,
    BadgeModule,
    ButtonModule,
    AvatarModule,
    ProgressBarModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    MenuModule,
    CheckboxModule,
    ProgressSpinnerModule,
    AppDatePipe,
    AppTimeAgoPipe,
    JobTitleCreateDialogComponent,
    ConfirmDialog,
    DepartmentUpdateDialogComponent,
    InitialsPipe
], templateUrl: './department-detail.component.html',
  styleUrl: './department-detail.component.scss',
  providers: [ConfirmationService],

})

export class DepartmentDetailComponent implements OnInit {

  // Department data
  departmentId!: string;
  department!: DepartmentDetailResponseModel;
  departmentStats: any;
  designationDistribution: any[] = [];
  isLoading = signal(false);

  activeTabIndex = 0;
  // Tab loading states
  jobTitlesTabLoaded = signal(false);
  employeeTabLoaded = signal(false);
  settingTabLoaded = signal(false);

  // Tab loading states
  isJobTitlesLoading = signal(false);
  isEmployeesLoading = signal(false);
  isSettingsLoading = signal(false);

  // Job Titles
  jobTitles: JobTitleWithEmployeeCountResponseModel[] = [];

  // Employees
  employees: EmployeeWithTitlesResponseModel[] = [];
  selectedFilterDesignationId: string | null = null;//designationId
  designationFilterOptions: { label: string; value: string | null }[] = [];

  isjobTitleCreateDialogOpen = signal(false);
  isUpdateDepartmentDialogOpen = signal(false);
  departmentToEdit = signal<DepartmentResponseModel | null>(null);


  // Recent Activity
  recentActivities: any[] = [];

  // Designation Distribution


  otherDepartments: { label: string, value: string }[] = [
    { label: 'Product Management', value: 'product' },
    { label: 'Quality Assurance', value: 'qa' },
    { label: 'Design', value: 'design' },
    { label: 'Operations', value: 'operations' }
  ];



  constructor(
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    public jobTitleService: JobTitleService,
    public employeeService: EmployeeService,
    public destinationService: DesignationService,
    private messageService: MessageService,
    private router: Router

  ) { }

  ngOnInit() {
    // Simulate loading
    this.isLoading.set(true);

    this.departmentId = this.route.snapshot.paramMap.get('id')!;
    if (!this.departmentId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Department ID is missing.'
      });
      return;
    }

    this.loadDepartmentData();
    this.loadDestinationsForFilters();

    // Load overview tab data immediately
    this.jobTitlesTabLoaded.set(false);
    this.employeeTabLoaded.set(false);
    this.settingTabLoaded.set(false);

  }

  loadDepartmentData() {
    this.departmentService.getById(this.departmentId).subscribe({
      next: (dept) => {
        this.department = dept;
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });

    // Department statistics
    this.departmentStats = {
      jobTitleCount: 8,
      activeJobTitles: 7,
      employeeCount: 42,
      totalProjects: 12,
      activeProjects: 8,
      teamLeads: 6,
      projectManagers: 4
    };






    // Recent activities
    this.recentActivities = [
      {
        userInitials: 'JS',
        description: 'Added new job title: Mobile Developer',
        timestamp: new Date('2024-11-20T10:30:00'),
        color: '#3b82f6'
      },
      {
        userInitials: 'AD',
        description: 'Updated department description',
        timestamp: new Date('2024-11-19T14:20:00'),
        color: '#8b5cf6'
      },
      {
        userInitials: 'HR',
        description: 'Assigned 3 new employees to department',
        timestamp: new Date('2024-11-18T09:15:00'),
        color: '#10b981'
      },
      {
        userInitials: 'JS',
        description: 'Changed department head to John Smith',
        timestamp: new Date('2024-11-17T16:45:00'),
        color: '#3b82f6'
      },
      {
        userInitials: 'SM',
        description: 'Created new project: E-commerce Platform',
        timestamp: new Date('2024-11-16T11:30:00'),
        color: '#f59e0b'
      }
    ];

    // Designation distribution
    this.designationDistribution = [
      { designation: 'Junior', count: 8, percentage: 19 },
      { designation: 'Mid-level', count: 18, percentage: 43 },
      { designation: 'Senior', count: 12, percentage: 29 },
      { designation: 'Lead', count: 3, percentage: 7 },
      { designation: 'Principal', count: 1, percentage: 2 }
    ];
  }
  loadDestinationsForFilters() {
    this.destinationService.getListAll().subscribe({
      next: (response: DesignationResponseModel[]) => {
        // Map the API data to your dropdown format
        const options = (response || []).map(designation => ({
          label: designation.name,
          value: designation.id
        }));

        // Set the final array with the 'All' option at index 0
        this.designationFilterOptions = [
          { label: 'All Designations', value: null },
          ...options
        ];
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error("Failed to load designations", err)
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  // Tab change handler
  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    console.log('Active Tab Index:', this.activeTabIndex);
    switch (event.index) {
      case 1: // Tasks
        if (!this.jobTitlesTabLoaded()) {
          this.jobTitleService.pageNumber.set(1);
          this.loadJobTitles();
          this.jobTitlesTabLoaded.set(true);

        }
        break;

      case 2: // Teams
        if (!this.employeeTabLoaded()) {
          this.employeeService.pageNumber.set(1);
          this.loadEmployees();
          this.employeeTabLoaded.set(true);
        }
        break;

      case 3: // Collaborators
        if (!this.settingTabLoaded()) {
          this.settingTabLoaded.set(true);
        }
        break;
    }
  }

  refreshJobTitleTab() {
    this.jobTitleService.pageNumber.set(1);
    this.loadJobTitles();
  }

  refreshEmployeesTab() {
    this.employeeService.pageNumber.set(1);
    this.selectedFilterDesignationId = null;
    this.loadEmployees();
  }

  refreshSettingTab() {
  }

  loadJobTitles() {
    this.isJobTitlesLoading.set(true);
    console.log("Loading Tab Job Titles---------------");

    const param: GetJobTitleListQuery = {
      departmentId: this.department.id,
    };

    this.jobTitleService
      .getJobTitles(param)
      .pipe(finalize(() => this.isJobTitlesLoading.set(false)))
      .subscribe({
        next: (response: PagedResult<JobTitleWithEmployeeCountResponseModel>) => {
          this.jobTitles = response.items;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load job titles.',
            life: 3000
          });
        }
      });
  }


  onJobTitlePageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;

    this.jobTitleService.pageNumber.set(pageNumber);
    this.jobTitleService.pageSize.set(event.rows);
    this.loadJobTitles();
  }



  loadEmployees() {
    this.isEmployeesLoading.set(true);
    console.log("Loading Tab Employees---------------");

    const param: GetEmployeeListQuery = {
      departmentId: this.departmentId,
      designationId: this.selectedFilterDesignationId ? this.selectedFilterDesignationId : undefined
    };

    this.employeeService
      .getWithTitlesList(param)
      .pipe(finalize(() => this.isEmployeesLoading.set(false)))
      .subscribe({
        next: (response: PagedResult<EmployeeWithTitlesResponseModel>) => {
          this.employees = response.items;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load employees.',
            life: 3000
          });
        }
      });
  }

  onEmployeePageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;

    this.employeeService.pageNumber.set(pageNumber);
    this.employeeService.pageSize.set(event.rows);
    this.loadEmployees();
  }


  onEmployeeDesignationFilterChange() {
    this.employeeService.pageNumber.set(1);
    this.loadEmployees();
  }

  getDesignationSeverity(designation: string): string {
    switch (designation?.toLowerCase()) {
      case 'junior': return 'info';
      case 'mid-level': return 'success';
      case 'senior': return 'warning';
      case 'lead': return 'danger';
      case 'principal': return 'help';
      default: return 'info';
    }
  }

  // Event handlers


  openNewJobTitle() {
    this.isjobTitleCreateDialogOpen.set(true);
    console.log('Add new job title for department:', this.department.id);
  }
  onJobTitleCreated() {
    this.loadJobTitles(); // Refresh the list
  }

  openUpdateDepartment() {
    this.departmentToEdit.set(this.department);
    this.isUpdateDepartmentDialogOpen.set(true);
    console.log('Edit department:', this.department.id);
  }

  onDepartmentUpdated() {
    this.loadDepartmentData(); // Refresh the list
  }
  onUpdateDepartmentDialogHide() {
    this.departmentToEdit.set(null);
    this.isUpdateDepartmentDialogOpen.set(false);
  }
  goBack() {
    this.router.navigate(['/admin/departments']); // Adjust the path to your main list
  }
}