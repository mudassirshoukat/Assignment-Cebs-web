import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
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
import { EmployeeService } from '../../../../core/services/domain/employee.service';
import { DepartmentService } from '../../../../core/services/domain/department.service';
import { CreateDepartmentRequestModel } from '../../../../core/models/department/request/create-department-request.model';

@Component({
  selector: 'app-department-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './department-create-dialog.component.html',
  styleUrl: './department-create-dialog.component.scss',
})
export class DepartmentCreateDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() departmentCreated = new EventEmitter<void>();

  createForm!: FormGroup;

  submitted = false;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private messageService: MessageService,
  ) { }
  ngOnInit(): void {
    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

  }

  get f() {
    return this.createForm.controls;
  }

  submit() {
    this.isSubmitting.set(true);

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.isSubmitting.set(false);
      return;
    }

    const formValue = this.createForm.value;

    const departmentRequest: CreateDepartmentRequestModel = {
      name: formValue.name,
      description: formValue.description,
    };

    this.departmentService.create(departmentRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Department Created',
          life: 3000,
        });
        this.departmentCreated.emit(); // Tell parent to refresh list
        this.closeDialog();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create department.',
          life: 3000,
        });
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  closeDialog() {
    this.createForm.reset();
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.submitted = false;
    this.isSubmitting.set(false);
  }
}
