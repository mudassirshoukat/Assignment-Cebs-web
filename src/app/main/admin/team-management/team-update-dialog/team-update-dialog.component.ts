import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // <-- ADDED ReactiveFormsModule
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { RoleEnum } from '../../../../core/enums/role.enum';
import { TeamResponseModel } from '../../../../core/models/team/team-response.model';
import { TeamService } from '../../../../core/services/domain/team.service';
import { UpdateTeamRequestModel } from '../../../../core/models/team/update-team-request.model';



@Component({
  selector: 'app-team-update-dialog',
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
  templateUrl: './team-update-dialog.component.html',
  styleUrl: './team-update-dialog.component.scss',
})
export class TeamUpdateDialogComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() team: TeamResponseModel | null = null; // Team data from the parent
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() teamUpdated = new EventEmitter<void>();

  // Reactive Form Declaration
  updateForm!: FormGroup;

  isSubmitting = signal(false);

 
  constructor(
    private fb: FormBuilder, // <-- ADD FormBuilder
    private teamService: TeamService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Initialize the form structure with default values
    this.updateForm = this.fb.group({
      // We still need the ID for the API call, even if it's not a visible field
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required]],
    });
  }

  // Load the current team data into the update form when the input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['team'] && this.team) {
      // Use patchValue to set the form controls when the input data arrives
      this.updateForm.patchValue({
        id: this.team.id,
        name: this.team.name,
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

    const teamRequest: UpdateTeamRequestModel = {
      id: formValue.id,
      name: formValue.name,
    };

    // 1. Business Logic: Call the service to update the invitation
    this.teamService.update(teamRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Updated', life: 3000 });
        this.teamUpdated.emit();
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update team.', life: 3000 });
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