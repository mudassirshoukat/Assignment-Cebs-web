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
import { CreateProjectRequestModel } from '../../../../core/models/project/requests/create-project-request.model';
import { EmployeeService } from '../../../../core/services/domain/employee.service';
import { ProjectService } from '../../../../core/services/domain/project.service';

@Component({
  selector: 'app-project-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './project-create-dialog.component.html',
  styleUrl: './project-create-dialog.component.scss',
})
export class ProjectCreateDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() projectCreated = new EventEmitter<void>();

  createForm!: FormGroup;

  submitted = false;
  isSubmitting = signal(false);
  managers: EmployeeResponseModel[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
  ) { }
  ngOnInit(): void {
    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      managerId: [null], // Validator removed, changed '' to null
      description: ['', [Validators.required]],
    });

    this.loadManagers();
  }

  get f() {
    return this.createForm.controls;
  }

  loadManagers() {
    this.employeeService.getListAll().subscribe({
      next: (response: EmployeeResponseModel[]) => {
        this.managers = response;
        console.log('Employees loaded for team creation:', response);
      },
    });
  }

  submit() {
    this.isSubmitting.set(true);
    console.log(this.createForm);

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const formValue = this.createForm.value;

    const projectRequest: CreateProjectRequestModel = {
      name: formValue.name,
      description: formValue.description,
      managerId: formValue.managerId ?? null,
    };

    this.projectService.create(projectRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Project Created',
          life: 3000,
        });
        this.projectCreated.emit(); // Tell parent to refresh list
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create project.',
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
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.submitted = false;
    this.isSubmitting.set(false);
  }
}
