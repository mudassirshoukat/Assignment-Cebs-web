import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { finalize } from 'rxjs/operators'; // For modern pipe usage

// --- Primeng Imports (Keep all original ones) ---
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

// --- Feature Imports (UPDATED) ---
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectStatusEnum } from '../../../core/enums/project/project-status.enum';
import { PagedResult } from '../../../core/models/_pagination/paged-result-response.model';
import { ProjectDetailResponseModel } from '../../../core/models/project/project-detail-response.model';
import { ProjectResponseModel } from '../../../core/models/project/project-response.model';
import { ArchiveProjectRequestModel } from '../../../core/models/project/requests/archive-project-request.model';
import { ProjectService } from '../../../core/services/domain/project.service';
import { ProjectCreateDialogComponent } from './project-create-dialog/project-create-dialog.component';
import { ProjectUpdateDialogComponent } from './project-update-dialog/project-update-dialog.component';

@Component({
    selector: 'app-project-management',
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        // Updated Dialog Components
        ProjectCreateDialogComponent,
        ProjectUpdateDialogComponent,
        Card,
        MenuModule,
        SplitButtonModule,
    ],
    templateUrl: './project-management.component.html',
    styleUrl: './project-management.component.scss',
    providers: [ProjectService, ConfirmationService],
})
export class ProjectManagementComponent implements OnInit {
    getProjectManagerName(project: ProjectResponseModel): string | null {
        if (project.projectManagerId && project.projectManager)
            return project.projectManager.fullName;
        return null;
    }

    // --- State Signals (Modern Angular) ---
    projectActionsMap: { [id: number]: any[] } = {};

    projects = signal<ProjectResponseModel[]>([]);
    isLoading = signal(false);
    selectedProjects = signal<ProjectResponseModel[] | null>(null);

    // --- Dialog Management State ---
    isCreateDialogOpen = signal(false);
    isUpdateDialogOpen = signal(false);
    selectedProjectToEdit = signal<ProjectResponseModel | null>(null);

    @ViewChild('dt') dt!: Table;
   

    items: MenuItem[] = [];

    // Function to show the menu

    constructor(
        public projectService: ProjectService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.loadProjects();
    }

    onPageChange(event: any) {
        const pageNumber = Math.floor(event.first / event.rows) + 1; // correct page number
        this.projectService.pageNumber.set(pageNumber);
        this.projectService.pageSize.set(event.rows);

        this.loadProjects();
    }

    loadProjects() {
        this.isLoading.set(true);

        this.projectService
            .getProjects()
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (response: PagedResult<ProjectResponseModel>) => {
                    this.projects.set(response.items);
                    console.log('Total Count:', this.projectService.totalCount());
                    console.log('Page Number:', this.projectService.pageNumber());
                },
                error: (error) => {
                    console.error('Error fetching projects:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load projects.',
                        life: 3000,
                    });
                },
            });
    }

    isArchivable(project: ProjectResponseModel): boolean {
        return !project.isArchived;

        // && project.status !== ProjectStatusEnum.Active &&
        //  project.status !== ProjectStatusEnum.Draft;
    }

    toggleArchive(value: boolean, id: string) {
        this.isLoading.set(true);

        const request: ArchiveProjectRequestModel = {
            id: id,
            isArchived: value,
        };

        this.projectService.toggleArchive(request).subscribe({
            next: (updatedProject: ProjectResponseModel) => {
                this.projects.update((list) =>
                    list.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: value ? 'Project Archived' : 'Project Unarchived',
                });
                this.isLoading.set(false);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: value
                        ? 'Failed to archive project.'
                        : 'Failed to unarchive project.',
                });
                this.isLoading.set(false);
            },
        });
    }

    deleteProject(project: ProjectResponseModel) {
        this.isLoading.set(true);
        this.confirmationService.confirm({
            message: `Are you sure you want to revoke the project for ${project.name}?`,
            header: 'Confirm Revocation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.projectService.getById(project.id).subscribe({
                    next: (updatedProject: ProjectDetailResponseModel) => {
                        this.projects.update((list) =>
                            list.filter((i) => i.id !== updatedProject.id),
                        );
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Project Revoked',
                        });
                        this.isLoading.set(false);
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to revoke project.',
                        });
                        this.isLoading.set(false);
                    },
                });
            },
        });
    }

    // --- Dialog Openers ---
    public isEditable(status: ProjectStatusEnum): boolean {
        return (
            status === ProjectStatusEnum.Draft ||
            status === ProjectStatusEnum.Active ||
            status === ProjectStatusEnum.OnHold
        );
    }

    openNew() {
        this.isCreateDialogOpen.set(true);
    }

    onProjectCreated() {
        this.loadProjects(); // Refresh the list
    }

    editProject(project: ProjectResponseModel) {
        this.selectedProjectToEdit.set(project);
        this.isUpdateDialogOpen.set(true);
    }

    // --- Dialog Event Handlers ---


    onProjectUpdated() {
        this.loadProjects(); // Refresh the list
    }

    onUpdateDialogHide() {
        this.isUpdateDialogOpen.set(false);
        this.selectedProjectToEdit.set(null);
    }

    // --- Utility Methods ---

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    getSeverity(
        status: ProjectStatusEnum,
    ): 'info' | 'success' | 'warn' | 'danger' {
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

    getStatusText(status: ProjectStatusEnum) {
        return ProjectStatusEnum[status];
    }

    viewProjectDetails(project: ProjectResponseModel): void {
        this.router.navigate(['/admin/projects', project.id, 'details']);
    }
    // Add these methods to your component class

    showMenu(event: Event, project: ProjectResponseModel, menu: any) {
        this.items = [
            {
                label: 'View',
                icon: 'pi pi-eye',
                command: () => this.viewProjectDetails(project),
            },
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => this.editProject(project),
                disabled: project.isArchived,
            },
        ];

        if (project.isArchived) {
            this.items.push({
                label: 'UnArchive',
                icon: 'pi pi-inbox',
                command: () => this.toggleArchive(false, project.id),
            });
        } else {
            this.items.push({
                label: 'Archive',
                icon: 'pi pi-inbox',
                command: () => this.toggleArchive(true, project.id),
            });
        }

        menu.toggle(event);
    }
}
