import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // <-- ADDED ReactiveFormsModule
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { MessageService } from 'primeng/api';
import { InvitationStatusEnum } from '../../../../core/enums/invitation/invitation-status.enum';
import { RoleEnum } from '../../../../core/enums/role.enum';
import { InvitationResponse } from '../../../../core/models/invitation/invitation-response.model';
import { UpdateInvitationRequestModel } from '../../../../core/models/invitation/update-invitation-request.model';
import { InvitationService } from '../../../../core/services/domain/invitation.service';

@Component({
  selector: 'app-invite-update-dialog',
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
  templateUrl: './invite-update-dialog.component.html',
  styleUrl: './invite-update-dialog.component.scss',
})
export class InviteUpdateDialogComponent implements OnInit, OnChanges {

  @Input() visible = false;
  @Input() invite: InvitationResponse | null = null; // Invitation data from the parent
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() inviteUpdated = new EventEmitter<void>();

  // Reactive Form Declaration
  updateForm!: FormGroup;

  isSubmitting = signal(false);


  constructor(
    private fb: FormBuilder, // <-- ADD FormBuilder
    private invitationService: InvitationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Initialize the form structure with default values
    this.updateForm = this.fb.group({
      // We still need the ID for the API call, even if it's not a visible field
      id: [{ value: '', disabled: true }],
      role: ['', [Validators.required]],
    });
  }

  // Load the current invite data into the update form when the input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invite'] && this.invite) {
      // Use patchValue to set the form controls when the input data arrives
      this.updateForm.patchValue({
        id: this.invite.id,
        role: this.invite.role,
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

    const inviteRequest: UpdateInvitationRequestModel = {
      id: formValue.id,
      role: formValue.role,
    };

    // 1. Business Logic: Call the service to update the invitation
    this.invitationService.update(inviteRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invitation Updated', life: 3000 });
        this.inviteUpdated.emit();
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update invite.', life: 3000 });
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
  getStatusText(status: InvitationStatusEnum) {
    return InvitationStatusEnum[status];
  }
  getRoleText(status: RoleEnum) {
    return RoleEnum[status];
  }
  getSeverity(status: InvitationStatusEnum) {
    if (status === InvitationStatusEnum.Accepted) return 'success';
    if (status === InvitationStatusEnum.Revoked) return 'warn';
    return 'info';
  }
}