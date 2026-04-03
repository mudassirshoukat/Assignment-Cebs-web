import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { MessageService } from 'primeng/api';
import { RoleEnum } from '../../../../core/enums/role.enum';
import { EmployeeResponseModel } from '../../../../core/models/employee/employee-response.model';
import { DepartmentService } from '../../../../core/services/domain/department.service';
import { JobTitleService } from '../../../../core/services/domain/job-title.service';
import { DepartmentResponseModel } from '../../../../core/models/department/department-response.model';
import { DesignationResponseModel } from '../../../../core/models/designation/designation-response.model';
import { DesignationService } from '../../../../core/services/domain/designation.service';
import { CreateJobTitleRequestModel } from '../../../../core/models/job-title/request/create-job-title-request.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogService } from '../../../../shared/services/dialog.service';
@Component({
  selector: 'app-jobtitle-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, MultiSelectModule],
  templateUrl: './job-title-create-dialog.component.html',
  styleUrl: './job-title-create-dialog.component.scss',
})
export class JobTitleCreateDialogComponent implements OnInit,OnChanges {
  @Input() visible = false;
  @Input() departmentId?: string;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() jobTitleCreated = new EventEmitter<void>();

  createForm!: FormGroup;

  submitted = false;
  isSubmitting = signal(false);

  departments: DepartmentResponseModel[] = [];
  designations: DesignationResponseModel[] = [];

  constructor(
    private fb: FormBuilder,
    private jobTitleService: JobTitleService,
    private departmentService: DepartmentService,
    private designationService: DesignationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      departmentId: [{ value: null, disabled: false }, Validators.required],
      commonDesignationIds: [[]],
    });
    console.log("pre department value", this.departmentId);
    this.loadDepartments();
    this.loadDesignations();

  }
ngOnChanges(changes: SimpleChanges) {
    // Detect when the dialog is opened (visible becomes true)
    if (changes['visible']?.currentValue === true) {
      this.handleOpen();
    }
  }

  private handleOpen() {
    // If we have a departmentId, make sure the form reflects it every time it opens
    if (this.departmentId && this.departments.length > 0) {
      this.applyDepartmentContext();
    }
  }

  get f() {
    return this.createForm.controls;
  }

  loadDepartments() {
    this.departmentService.getLookup().subscribe({
      next: (res => {
        this.departments = res
        if (this.departmentId) {
          this.applyDepartmentContext();
        }
      }),
    });
  }

  loadDesignations() {
    this.designationService.getListAll().subscribe({
      next: (res) => (this.designations = res.sort(x => x.rank)),
    });
  }

  private applyDepartmentContext() {
    const exists = this.departments.some(
      d => d.id === this.departmentId
    );

    if (!exists) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Department',
        detail: 'The selected department no longer exists.',
        life: 3000,
      });
      this.closeDialog();
      return;
    }

    this.createForm.patchValue({
      departmentId: this.departmentId
    });

    this.createForm.get('departmentId')?.disable();
  }


  submit() {
    this.submitted = true;

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.createForm.getRawValue();

    const request: CreateJobTitleRequestModel = {
      name: formValue.name,
      description: formValue.description,
      departmentId: formValue.departmentId,
      commonDesignationIds: formValue.commonDesignationIds?.length
        ? formValue.commonDesignationIds
        : undefined,
    };

    this.jobTitleService.create(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Job Title created successfully',
          life: 3000,
        });
        this.jobTitleCreated.emit();
        this.closeDialog();
      },
      error: () => {
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.submitted = false;
    this.isSubmitting.set(false);
    this.createForm.reset({
      commonDesignationIds: [],
    });
  }
}
