import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // <-- ADDED ReactiveFormsModule
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { JobTitleResponseModel } from '../../../../core/models/job-title/job-title-response.model';
import { JobTitleService } from '../../../../core/services/domain/job-title.service';
import { UpdateJobTitleRequestModel } from '../../../../core/models/job-title/request/update-job-title-request.model';




@Component({
  selector: 'app-jobtitle-update-dialog',
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
  templateUrl: './job-title-update-dialog.component.html',
  styleUrl: './job-title-update-dialog.component.scss',
})
export class JobTitleUpdateDialogComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() jobtitle: JobTitleResponseModel | null = null; // JobTitle data from the parent
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() jobtitleUpdated = new EventEmitter<void>();

  // Reactive Form Declaration
  updateForm!: FormGroup;

  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder, // <-- ADD FormBuilder
    private jobtitleService: JobTitleService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    //initializing form
    this.updateForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  // Load the current jobtitle data into the update form when the input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobtitle'] && this.jobtitle) {
      // Use patchValue to set the form controls when the input data arrives
      this.updateForm.patchValue({
        id: this.jobtitle.id,
        name: this.jobtitle.name,
        description: this.jobtitle.description,
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

    const jobtitleRequest: UpdateJobTitleRequestModel = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      
    };

    // 1. Business Logic: Call the service to update the invitation
    this.jobtitleService.update(jobtitleRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'JobTitle Updated', life: 3000 });
        this.jobtitleUpdated.emit();
        this.closeDialog();
      },
      error: (err) => {
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
}