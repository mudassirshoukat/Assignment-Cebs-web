import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { MessageService } from 'primeng/api';
import { TeamService } from '../../../../core/services/domain/team.service';
import { CreateTeamMemberRequestModel } from '../../../../core/models/team-member/create-team-member-request.model';
import { CreateTeamWithMembersRequestModel } from '../../../../core/models/team/create-team-with-members-request.model';
import { EmployeeService } from '../../../../core/services/domain/employee.service';
import { EmployeeResponseModel } from '../../../../core/models/employee/employee-response.model';
import { RoleEnum } from '../../../../core/enums/role.enum';

@Component({
  selector: 'app-team-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './team-create-dialog.component.html',
  styleUrl: './team-create-dialog.component.scss',
})
export class TeamCreateDialogComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() teamCreated = new EventEmitter<void>();

  createForm!: FormGroup;
  employees: EmployeeResponseModel[] = [];

  submitted = false;
  isSubmitting = signal(false);


  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.loadEmployees();

    this.createForm = this.fb.group({
      name: ['', Validators.required],
      leadId: ['', Validators.required],
    });
  }


  get f() {
    return this.createForm.controls;
  }

  loadEmployees() {
    this.employeeService.getListAll().subscribe({
      next: (response: EmployeeResponseModel[]) => {
        this.employees = response;
        console.log('Employees loaded for team creation:', response);
      }
    });
  }

  selectedMembers: string[] = [];
  selectedMemberToAdd: string | null = null;

  addMember(empId: string | null) {
    if (!empId) return; // ignore if nothing selected
    if (!this.selectedMembers.includes(empId)) {
      this.selectedMembers.push(empId);
      this.selectedMemberToAdd = null;
    }
  }

  removeMember(empId: string) {
    this.selectedMembers = this.selectedMembers.filter(id => id !== empId);
  }

  getEmployeeNameById(empId: string): string {
    const emp = this.employees.find(e => e.id === empId);
    return emp ? emp.fullName : '';
  }

  // Check if a Lead has been selected yet
  get isLeadSelected(): boolean {
    return !!this.f['leadId'].value;
  }


submit() {
    this.isSubmitting.set(true);
    this.createForm.markAllAsTouched();

    // 1. Basic Form & Members Length Validation
    if (this.createForm.invalid || this.selectedMembers.length === 0) {
      if (this.selectedMembers.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Please add at least one team member.',
          life: 3000
        });
      }
      this.isSubmitting.set(false);
      return;
    }

    const formValue = this.createForm.value;

    // 2. STRICT GUARD: Ensure Lead is not in the Member list
    // This handles the case where a user added a member and then later selected them as Lead
    const finalMemberIds = this.selectedMembers.filter(id => id !== formValue.leadId);

    if (finalMemberIds.length === 0) {
        this.messageService.add({
            severity: 'error',
            summary: 'Validation',
            detail: 'A team must have at least one member who is not the Lead.',
            life: 3000
        });
        this.isSubmitting.set(false);
        return;
    }

    // 3. Construct Request
    const teamRequest: CreateTeamWithMembersRequestModel = {
      name: formValue.name,
      leadId: formValue.leadId,
      memberIds: finalMemberIds // Use the filtered list
    };

    this.teamService.createWithMembers(teamRequest).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Created', life: 3000 });
        this.teamCreated.emit(); // Tell parent to refresh list
        this.closeDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create team.', life: 3000 });
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
    this.submitted = false;
    this.isSubmitting.set(false);
  }
}

