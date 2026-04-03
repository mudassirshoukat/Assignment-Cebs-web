import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // <-- ADDED ReactiveFormsModule
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProjectStatusEnum } from '../../../../core/enums/project/project-status.enum';
import { RoleEnum } from '../../../../core/enums/role.enum';
import { ProjectResponseModel } from '../../../../core/models/project/project-response.model';
import { UpdateProjectRequestModel } from '../../../../core/models/project/update-project-request.model';
import { ProjectService } from '../../../../core/services/domain/project.service';



@Component({
  selector: 'app-project-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Keep for compatibility, but primarily using Reactive
    ReactiveFormsModule, // <-- New Import
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule
  ],
  templateUrl: './project-update-dialog.component.html',
  styleUrl: './project-update-dialog.component.scss',
})
export class ProjectUpdateDialogComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() project: ProjectResponseModel | null = null; // Project data from the parent
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() projectUpdated = new EventEmitter<void>();

  // Reactive Form Declaration
  updateForm!: FormGroup;

  isSubmitting = signal(false);

 

  constructor(
    private fb: FormBuilder, // <-- ADD FormBuilder
    private projectService: ProjectService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Initialize the form structure with default values
    this.updateForm = this.fb.group({
      // We still need the ID for the API call, even if it's not a visible field
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  // Load the current project data into the update form when the input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      // Use patchValue to set the form controls when the input data arrives
      this.updateForm.patchValue({
        id: this.project.id,
        name: this.project.name,
        description: this.project.description,
      });
    }
  }

  submitUpdate() {
    console.log(this.updateForm);
    if (this.updateForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.updateForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Get the ID from the disabled control and the role from the enabled control
    const formValue = this.updateForm.getRawValue(); // use getRawValue to include 'id'

    const projectRequest: UpdateProjectRequestModel = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
    };

    // 1. Business Logic: Call the service to update the invitation
    this.projectService.update(projectRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Updated', life: 3000 });
        this.projectUpdated.emit();
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update project.', life: 3000 });
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.isSubmitting.set(false);
    this.updateForm.reset(); // Reset the form state
  }

  // ... (Keep your helper methods: getStatusText, getRoleText, getSeverity)
  getStatusText(status: ProjectStatusEnum) {
    return ProjectStatusEnum[status];
  }
  getRoleText(status: RoleEnum) {
    return RoleEnum[status];
  }
  getSeverity(status: ProjectStatusEnum): 'info' | 'success' | 'warn' | 'danger' {
    switch (status) {

      case ProjectStatusEnum.Active:
      case ProjectStatusEnum.Draft:
        return 'info';

      case ProjectStatusEnum.Completed:
        return 'success';

      case ProjectStatusEnum.OnHold:
        return 'warn';

      case ProjectStatusEnum.Cancelled:
      case ProjectStatusEnum.Archived:
        return 'danger';

      default:
        return 'info';
    }
  }

}