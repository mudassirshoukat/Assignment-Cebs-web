import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
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
import { TooltipModule } from 'primeng/tooltip';
import { PagedResult } from '../../../core/models/_pagination/paged-result-response.model';
import { TeamDetailResponseModel } from '../../../core/models/team/team-detail-response.model';
import { TeamResponseModel } from '../../../core/models/team/team-response.model';
import { TeamService } from '../../../core/services/domain/team.service';
import { TeamCreateDialogComponent } from './team-create-dialog/team-create-dialog.component';
import { TeamUpdateDialogComponent } from './team-update-dialog/team-update-dialog.component';
import { ArchiveTeamRequestModel } from '../../../core/models/team/archive-team-request.model';
import { Card } from "primeng/card";
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
    selector: 'app-team-management',
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
        TeamCreateDialogComponent,
        TeamUpdateDialogComponent,
        Card,
        MenuModule,
        SplitButtonModule
    ],
    templateUrl: './team-management.component.html',
    styleUrl: './team-management.component.scss',
    providers: [TeamService, ConfirmationService]
})
export class TeamManagementComponent implements OnInit {

    // --- State Signals (Modern Angular) ---

    teams = signal<TeamResponseModel[]>([]);
    isLoading = signal(false);
    selectedTeams = signal<TeamResponseModel[] | null>(null);

    // --- Dialog Management State ---
    isCreateDialogOpen = signal(false);
    isUpdateDialogOpen = signal(false);
    selectedTeamToEdit = signal<TeamResponseModel | null>(null);

    @ViewChild('dt') dt!: Table;

    items: MenuItem[] = [];

    // Function to show the menu
    showMenu(event: Event, team: TeamResponseModel, menu: any) {
        this.items = [
            { label: 'View', icon: 'pi pi-eye', command: () => this.viewTeamDetails(team) },
            { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editTeam(team), disabled: team.isArchived }
        ];

        if (team.isArchived) {
            this.items.push({ label: 'UnArchive', icon: 'pi pi-inbox', command: () => this.toggleArchive(false, team.id) });
        } else {
            this.items.push({ label: 'Archive', icon: 'pi pi-inbox', command: () => this.toggleArchive(true, team.id) });
        }

        menu.toggle(event);
    }

    viewTeamDetails(team: TeamResponseModel): void {
        this.router.navigate(['/admin/teams', team.id, 'details']);
    }


    constructor(
        public teamService: TeamService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadTeams();
    }

    onPageChange(event: any) {
        const pageNumber = Math.floor(event.first / event.rows) + 1; // correct page number
        this.teamService.pageNumber.set(pageNumber);
        this.teamService.pageSize.set(event.rows);

        this.loadTeams();
    }


    loadTeams() {
        this.isLoading.set(true);

        this.teamService
            .getTeams()
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (response: PagedResult<TeamResponseModel>) => {
                    this.teams.set(response.items);
                    console.log('Total Count:', this.teamService.totalCount());
                    console.log('Page Number:', this.teamService.pageNumber());
                },
                error: (error) => {
                    console.error('Error fetching teams:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load teams.',
                        life: 3000
                    });
                }
            });
    }


    toggleArchive(value: boolean, id: string) {
        this.isLoading.set(true);

        const request: ArchiveTeamRequestModel = {
            id: id,
            isArchived: value
        };


        this.teamService.toggleArchive(request).subscribe({
            next: (updatedTeam: TeamResponseModel) => {
                this.teams.update(list =>
                    list.map(p => p.id === updatedTeam.id ? updatedTeam : p)
                );
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: value ? 'Team Archived' : 'Team Unarchived' });
                this.isLoading.set(false);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: value ? 'Failed to archive team.' : 'Failed to unarchive team.' });
                this.isLoading.set(false);
            }
        });
    }



    deleteTeam(team: TeamResponseModel) {
        this.isLoading.set(true);
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the team for ${team.name}?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.teamService.getById(team.id).subscribe({
                    next: (updatedTeam: TeamDetailResponseModel) => {

                        this.teams.update(list =>
                            list.filter(i => i.id !== updatedTeam.id)
                        );
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Team Deleted' });
                        this.isLoading.set(false);

                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete team.' });
                        this.isLoading.set(false);
                    }
                });
            }
        });
    }

    // --- Dialog Openers ---

    openNew() {
        this.isCreateDialogOpen.set(true);
    }

    editTeam(team: TeamResponseModel) {
        this.selectedTeamToEdit.set(team);
        this.isUpdateDialogOpen.set(true);
    }

    // --- Dialog Event Handlers ---

    onTeamCreated() {
        this.loadTeams(); // Refresh the list
    }

    onTeamUpdated() {
        this.loadTeams(); // Refresh the list
    }

    onUpdateDialogHide() {
        this.isUpdateDialogOpen.set(false);
        this.selectedTeamToEdit.set(null);
    }

    // --- Utility Methods ---


    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

}
