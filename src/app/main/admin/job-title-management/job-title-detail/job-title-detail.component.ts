import { Component, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';

// Router
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobTitleDetailResponseModel } from '../../../../core/models/job-title/job-title-detail-response.model';
import { JobTitleService } from '../../../../core/services/domain/job-title.service';
import { finalize } from 'rxjs';
import { DepartmentResponseModel } from '../../../../core/models/department/department-response.model';
import { AppDatePipe } from "../../../../shared/pipes/app-date.pipe";
import { AppTimeAgoPipe } from "../../../../shared/pipes/app-time-ago.pipe";
import { JobTitleUpdateDialogComponent } from "../job-title-update-dialog/job-title-update-dialog.component";
import { JobTitleResponseModel } from '../../../../core/models/job-title/job-title-response.model';

@Component({
  selector: 'app-job-title-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    SelectButtonModule,
    CheckboxModule,
    MultiSelectModule,
    ProgressBarModule,
    MenuModule,
    TooltipModule,
    AvatarModule,
    BadgeModule,
    AppDatePipe,
    AppTimeAgoPipe,
    JobTitleUpdateDialogComponent
],
  templateUrl: './job-title-detail.component.html',
  styleUrl: './job-title-detail.component.scss'
})
export class JobTitleDetailComponent implements OnInit {
  jobTitleId!: string;
  jobTitle!: JobTitleDetailResponseModel;
  isLoading = signal(false);

    isUpdateDialogOpen = signal(false);
    selectedJobTitleToEdit = signal<JobTitleResponseModel | null>(null);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private jobTitleService: JobTitleService,
    public router: Router
  ) {

  }

  ngOnInit() {
    // Get department ID from route
    this.jobTitleId = this.route.snapshot.params['id'];

    this.loadJobTitle();
  }
  loadJobTitle() {
    this.isLoading.set(true);

    this.jobTitleService.getById(this.jobTitleId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: JobTitleDetailResponseModel) => {
          this.jobTitle = response;
        },
        error: (err) => console.error(err)
      });
  }

  openEditDialog(): void {
  if (!this.jobTitle) return;

  this.selectedJobTitleToEdit.set( {
    id: this.jobTitle.id,
    publicId: this.jobTitle.publicId,
    departmentId: this.jobTitle.departmentId,
    name: this.jobTitle.name,
    description: this.jobTitle.description,
    isActive: this.jobTitle.isActive,
    createdOn:this.jobTitle.createdOn,
    lastModifiedOn: this.jobTitle.lastModifiedOn

  });

  this.isUpdateDialogOpen.set(true);
}


   onJobTitleUpdated(): void {
    this.loadJobTitle();
  }

  onUpdateDialogHide(): void {
    this.isUpdateDialogOpen.set(false);
    this.selectedJobTitleToEdit.set(null);
  }

}