import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { DesignationLevelEnum } from '../../../../core/enums/designation/designation-level.enum';
import { DesignationResponseModel } from '../../../../core/models/designation/designation-response.model';
import { CreateDesignationRequestModel } from '../../../../core/models/designation/request/create-designation-request.model';
import { DesignationService } from '../../../../core/services/domain/designation.service';

@Component({
  selector: 'app-designation-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    DropdownModule,
    CheckboxModule
  ],
  templateUrl: './designation-create-dialog.component.html',
  styleUrls: ['./designation-create-dialog.component.scss'],
})
export class DesignationCreateDialogComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() designationCreated = new EventEmitter<void>();

  createForm!: FormGroup;
  submitted = false;
  isSubmitting = false;

  levelOptions = [
    { label: 'Executive', value: DesignationLevelEnum.Executive },
    { label: 'Management', value: DesignationLevelEnum.Management },
    { label: 'Individual Contributor', value: DesignationLevelEnum.IndividualContributor },
  ];

  rankOptions: number[] = [];

  constructor(
    private fb: FormBuilder,
    private designationService: DesignationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      level: [DesignationLevelEnum.IndividualContributor, Validators.required],
      rank: [null, Validators.required],
      description: ['', Validators.maxLength(500)],
      isSingleSeat: [false],  // NEW: Desgnation will only one employee in organization
      shiftRanksDown: [true],  // NEW: flag to shift all lower ranks
      canBeProjectManager: [false],
      canBeTeamLead: [false],
      canApproveTasks: [false],
      canAssignTasks: [false],
      canManageTeam: [false],
      canManageProjects: [false],
      canManageEmployees: [false],
      canReviewReports: [false],
    });

    // Reload ranks when level changes
    this.createForm.get('level')!.valueChanges.subscribe(level => {
      this.loadRankOptions(level);
    });

    // Initial load
    this.loadRankOptions(this.createForm.get('level')!.value);
  }

  get f() {
    return this.createForm.controls;
  }

  /** Load available rank positions for the selected level dynamically */
  loadRankOptions(level: DesignationLevelEnum) {
    this.designationService.getListAll().subscribe({
      next: (list: DesignationResponseModel[]) => {
        // Filter by level
        const levelList = list.filter(d => d.level === level);

        // Determine base rank for this level globally
        const execCount = list.filter(d => d.level === DesignationLevelEnum.Executive).length;
        const mgmtCount = list.filter(d => d.level === DesignationLevelEnum.Management).length;
        const icCount = list.filter(d => d.level === DesignationLevelEnum.IndividualContributor).length;

        let baseRank = 0;
        let levelSize = 0;

        switch (level) {
          case DesignationLevelEnum.Executive:
            baseRank = 0;
            levelSize = execCount;
            break;
          case DesignationLevelEnum.Management:
            baseRank = execCount;
            levelSize = mgmtCount;
            break;
          case DesignationLevelEnum.IndividualContributor:
            baseRank = execCount + mgmtCount;
            levelSize = icCount;
            break;
        }

        const minRank = baseRank + 1;
        const maxRank = baseRank + levelSize + 1; // allow append at end

        // Populate dropdown options
        this.rankOptions = Array.from({ length: maxRank - minRank + 1 }, (_, i) => minRank + i);

        // Default: append at end
        this.f['rank'].setValue(maxRank);
      },
      error: () => {
        this.rankOptions = [1];
        this.f['rank'].setValue(1);
      }
    });
  }

  formatRankDisplay(rank: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = rank % 100;
    return rank + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  formatPermissionLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  onSubmit() {
    this.submitted = true;
    this.createForm.markAllAsTouched();
    console.log(this.createForm)
    if (this.createForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields correctly.',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.createForm.value;

    const request: CreateDesignationRequestModel = {
      name: formValue.name,
      rank: formValue.rank,
      description: formValue.description || '',
      level: formValue.level,
      isSingleSeat: formValue.isSingleSeat, // NEW FLAG
      shiftRanksDown: formValue.shiftRanksDown, // NEW FLAG
      canBeProjectManager: formValue.canBeProjectManager,
      canBeTeamLead: formValue.canBeTeamLead,
      canApproveTasks: formValue.canApproveTasks,
      canAssignTasks: formValue.canAssignTasks,
      canManageTeam: formValue.canManageTeam,
      canManageProjects: formValue.canManageProjects,
      canManageEmployees: formValue.canManageEmployees,
      canReviewReports: formValue.canReviewReports
    };

    this.designationService.create(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Designation created successfully',
          life: 3000
        });
        this.designationCreated.emit();
        this.closeDialog();
      },
      error: (err) => {
        console.error('Designation creation failed:', err);
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.submitted = false;
    this.isSubmitting = false;
    this.createForm.reset({
      name: '',
      level: DesignationLevelEnum.IndividualContributor,
      rank: 1,
      shiftRanksDown: true,
      description: '',
      canBeProjectManager: false,
      canBeTeamLead: false,
      canApproveTasks: false,
      canAssignTasks: false,
      canManageTeam: false,
      canManageProjects: false,
      canManageEmployees: false,
      canReviewReports: false,
    });
  }
}
