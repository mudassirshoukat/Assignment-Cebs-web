import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

import { CreateInvitationRequestModel } from '../../../../core/models/invitation/create-invitation-request.model';
import { InvitationService } from '../../../../core/services/domain/invitation.service';
import { DepartmentService } from '../../../../core/services/domain/department.service';
import { JobTitleService } from '../../../../core/services/domain/job-title.service';
import { DesignationService } from '../../../../core/services/domain/designation.service';

import { DesignationResponseModel } from '../../../../core/models/designation/designation-response.model';
import { DepartmentResponseModel } from '../../../../core/models/department/department-response.model';
import { JobTitleResponseModel } from '../../../../core/models/job-title/job-title-response.model';
import { DesignationLevelEnum } from '../../../../core/enums/designation/designation-level.enum';

@Component({
  selector: 'app-invite-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './invite-create-dialog.component.html',
  styleUrl: './invite-create-dialog.component.scss',
})
export class InviteCreateDialogComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() inviteCreated = new EventEmitter<void>();

  createForm!: FormGroup;

  isSubmitting = signal(false);

  departments: DepartmentResponseModel[] = [];
  designations: DesignationResponseModel[] = [];
  jobTitles: JobTitleResponseModel[] = [];

  isExecutive = false;

  constructor(
    private fb: FormBuilder,
    private invitationService: InvitationService,
    private designationService: DesignationService,
    private departmentService: DepartmentService,
    private jobTitleService: JobTitleService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDesignations();
    this.loadDepartments();
  }

  private initializeForm() {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      designationId: [null, Validators.required],
      departmentId: [null],
      jobTitleId: [null],
    });
  }

  loadDesignations() {
    this.designationService.getListAll().subscribe({
      next: res => this.designations = res
    });
  }

  loadDepartments() {
    this.departmentService.getLookup().subscribe({
      next: res => this.departments = res
    });
  }

  onDesignationChanged() {
    const designationId = this.createForm.get('designationId')?.value;
    const designation = this.designations.find(d => d.id === designationId);

    this.isExecutive = designation?.level === DesignationLevelEnum.Executive;

    if (this.isExecutive) {
      // Executive → clear & disable department + job title
      this.createForm.patchValue({
        departmentId: null,
        jobTitleId: null
      });

      this.createForm.get('departmentId')?.disable();
      this.createForm.get('jobTitleId')?.disable();
    } else {
      // Non-executive → enable & require job title
      this.createForm.get('departmentId')?.enable();
      this.createForm.get('jobTitleId')?.enable();

      this.createForm.get('jobTitleId')?.setValidators([Validators.required]);
      this.createForm.get('jobTitleId')?.updateValueAndValidity();
    }
  }

  onDepartmentChanged() {
    const departmentId = this.createForm.get('departmentId')?.value;
    if (!departmentId) {
      this.jobTitles = [];
      return;
    }

    this.jobTitleService.getLookup(departmentId).subscribe({
      next: res => this.jobTitles = res
    });
  }

  submitInvite() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.createForm.value;
console.log(formValue);
    const request: CreateInvitationRequestModel = {
      email: formValue.email,
      designationId: formValue.designationId,
      jobTitleId: this.isExecutive ? undefined : formValue.jobTitleId
    };

    this.invitationService.create(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Invitation sent successfully'
        });
        this.inviteCreated.emit();
        this.closeDialog();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send invitation'
        });
        this.isSubmitting.set(false);
      }
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.createForm.reset();
    this.isSubmitting.set(false);
  }
}
