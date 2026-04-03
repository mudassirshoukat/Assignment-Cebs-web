import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { EmployeeWithTitlesResponseModel } from '../../../../core/models/employee/employee-with-titles-response.model';
import { DropdownModule } from 'primeng/dropdown';

// Models

export enum PlacementOption {
  SIBLING = 'sibling',
  PARENT = 'parent'
}

@Component({
  selector: 'app-employee-hierarchy-placement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    RadioButtonModule,
    TagModule,
    AvatarModule,
    BadgeModule,
    TooltipModule,
     SelectModule, // <-- USE SELECT MODULE, NOT DROPDOWN MODULE
    DropdownModule, // This is CRITICAL
  ],
  templateUrl: './employee-hierarchy-placement.component.html',
  styleUrls: ['./employee-hierarchy-placement.component.scss']
})
export class EmployeeHierarchyPlacementComponent implements OnInit {

  @Input() employee!: EmployeeWithTitlesResponseModel;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() placementComplete = new EventEmitter<any>();

  placementForm!: FormGroup;
  submitted = false;
  isSubmitting = false;

  // Available supervisors (dummy data)
  availableSupervisors: EmployeeWithTitlesResponseModel[] = [];

  // Selected supervisor details
  selectedSupervisor: EmployeeWithTitlesResponseModel | null = null;
  selectedSupervisorDirectReports: EmployeeWithTitlesResponseModel[] = [];

  // Placement options
  placementOption = PlacementOption.SIBLING;
  PlacementOption = PlacementOption; // Make enum available in template

  // Validation messages
  validationMessage = '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadDummyData();
  }

  initForm() {
    this.placementForm = this.fb.group({
      supervisorId: [null, Validators.required],
      placementOption: [PlacementOption.SIBLING, Validators.required]
    });

    // Listen to supervisor selection changes
    this.placementForm.get('supervisorId')?.valueChanges.subscribe(supervisorId => {
      this.onSupervisorChange(supervisorId);
    });

    // Listen to placement option changes
    this.placementForm.get('placementOption')?.valueChanges.subscribe(option => {
      this.placementOption = option as PlacementOption;
      this.validatePlacement();
    });
  }

  loadDummyData() {
    // Dummy supervisors data
    this.availableSupervisors = [
      {
        id: '1',
        publicId: 'EMP-1001',
        userId: 'user-1',
        firstName: 'John',
        lastName: 'Smith',
        fullName: 'John Smith',
        email: 'john.smith@company.com',
        designationId: '3',
        designationName: 'Director',
        designationRank: 4,
        jobTitleId: '7',
        jobTitleName: 'Director of Engineering',
        departmentId: '1',
        departmentName: 'Engineering',
        supervisorId: undefined,
        isOrphen: false,
        isActive: true,
        createdOn: new Date().toISOString(),
        lastModifiedOn: new Date().toISOString(),
      },
      {
        id: '2',
        publicId: 'EMP-1002',
        userId: 'user-2',
        firstName: 'Maria',
        lastName: 'Johnson',
        fullName: 'Maria Johnson',
        email: 'maria.j@company.com',
        designationId: '6',
        designationName: 'Manager',
        designationRank: 6,
        jobTitleId: '5',
        jobTitleName: 'Engineering Manager',
        departmentId: '1',
        departmentName: 'Engineering',
        supervisorId: '1',
        isOrphen: false,
        isActive: true,
        createdOn: new Date().toISOString(),
        lastModifiedOn: new Date().toISOString(),
      },
      {
        id: '3',
        publicId: 'EMP-1003',
        userId: 'user-3',
        firstName: 'Robert',
        lastName: 'Kim',
        fullName: 'Robert Kim',
        email: 'robert.k@company.com',
        designationId: '7',
        designationName: 'Lead',
        designationRank: 7,
        jobTitleId: '1',
        jobTitleName: 'Senior Software Engineer',
        departmentId: '1',
        departmentName: 'Engineering',
        supervisorId: '2',
        isOrphen: false,
        isActive: true,
        createdOn: new Date().toISOString(),
        lastModifiedOn: new Date().toISOString(),
      },
      {
        id: '4',
        publicId: 'EMP-1004',
        userId: 'user-4',
        firstName: 'Emma',
        lastName: 'Davis',
        fullName: 'Emma Davis',
        email: 'emma.d@company.com',
        designationId: '1',
        designationName: 'Chief Technology Officer',
        designationRank: 2,
        jobTitleId: undefined,
        jobTitleName: undefined,
        departmentId: undefined,
        departmentName: undefined,
        supervisorId: undefined,
        isOrphen: false,
        isActive: true,
        createdOn: new Date().toISOString(),
        lastModifiedOn: new Date().toISOString(),
      }
    ];

    // Dummy direct reports for selected supervisor
    this.selectedSupervisorDirectReports = [
      {
        id: '5',
        publicId: 'EMP-1005',
        userId: 'user-5',
        firstName: 'Tom',
        lastName: 'Wilson',
        fullName: 'Tom Wilson',
        email: 'tom.w@company.com',
        designationId: '8',
        designationName: 'Senior',
        designationRank: 8,
        jobTitleId: '1',
        jobTitleName: 'Senior Software Engineer',
        departmentId: '1',
        departmentName: 'Engineering',
        supervisorId: '2',
        isOrphen: false,
        isActive: true,
        createdOn: new Date().toISOString(),
        lastModifiedOn: new Date().toISOString(),
      },
      {
        id: '6',
        publicId: 'EMP-1006',
        userId: 'user-6',
        firstName: 'Sarah',
        lastName: 'Chen',
        fullName: 'Sarah Chen',
        email: 'sarah.c@company.com',
        designationId: '9',
        designationName: 'Mid-level',
        designationRank: 9,
        jobTitleId: '2',
        jobTitleName: 'Software Engineer',
        departmentId: '1',
        departmentName: 'Engineering',
        supervisorId: '2',
        isOrphen: false,
        isActive: true,
        createdOn: new Date().toISOString(),
        lastModifiedOn: new Date().toISOString(),
      }
    ];
  }

  onSupervisorChange(supervisorId: string) {
    this.selectedSupervisor = this.availableSupervisors.find(s => s.id === supervisorId) || null;

    if (this.selectedSupervisor) {
      // In real app, fetch direct reports from API
      // this.employeeService.getDirectReports(supervisorId).subscribe(reports => {...});

      this.validatePlacement();
    }
  }

  validatePlacement() {
    if (!this.selectedSupervisor || !this.employee) {
      this.validationMessage = '';
      return;
    }

    // Rule 1: Supervisor.Rank <= Employee.Rank
    if (this.selectedSupervisor.designationRank > this.employee.designationRank) {
      this.validationMessage = 'ERROR: Supervisor must have equal or higher rank (lower number) than employee.';
      return;
    }

    // Rule 2: Department consistency (if both have departments)
    if (this.selectedSupervisor.departmentId && this.employee.departmentId) {
      if (this.selectedSupervisor.departmentId !== this.employee.departmentId) {
        this.validationMessage = 'WARNING: Different departments. Supervisor is in ' +
          this.selectedSupervisor.departmentName +
          ', employee is in ' + this.employee.departmentName;
        return;
      }
    }

    // Check placement option specific validations
    if (this.placementOption === PlacementOption.PARENT && this.selectedSupervisorDirectReports.length === 0) {
      this.validationMessage = 'INFO: Selected as parent, but supervisor has no direct reports to reassign.';
      return;
    }

    this.validationMessage = 'VALID: Placement configuration is valid.';
  }

  onSubmit() {
    this.submitted = true;
    this.placementForm.markAllAsTouched();

    if (this.placementForm.invalid || this.validationMessage.includes('ERROR')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix validation errors before proceeding.',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;

    const formValue = this.placementForm.value;

    // Prepare placement data
    const placementData = {
      employeeId: this.employee.id,
      supervisorId: formValue.supervisorId,
      placementOption: formValue.placementOption as PlacementOption,
      reassignDirectReports: this.placementOption === PlacementOption.PARENT
        ? this.selectedSupervisorDirectReports.map(r => r.id)
        : []
    };

    console.log('Placing employee in hierarchy:', placementData);

    // Simulate API call
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.employee.fullName} has been placed in the organization hierarchy.`,
        life: 3000
      });

      this.placementComplete.emit(placementData);
      this.closeDialog();
      this.isSubmitting = false;
    }, 1500);
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.submitted = false;
    this.isSubmitting = false;
    this.selectedSupervisor = null;
    this.placementForm.reset({
      supervisorId: null,
      placementOption: PlacementOption.SIBLING
    });
  }

  // Helper methods for template
  get f() {
    return this.placementForm.controls;
  }

  getEmployeeDepartment(emp: EmployeeWithTitlesResponseModel): string {
    return emp.departmentName || 'Org-wide (No Department)';
  }

  getDesignationDisplay(emp: EmployeeWithTitlesResponseModel): string {
    return `${emp.designationName} (Rank: ${emp.designationRank})`;
  }

  getValidationSeverity(): string {
    if (this.validationMessage.includes('ERROR')) return 'danger';
    if (this.validationMessage.includes('WARNING')) return 'warning';
    if (this.validationMessage.includes('INFO')) return 'info';
    if (this.validationMessage.includes('VALID')) return 'success';
    return 'secondary';
  }
}