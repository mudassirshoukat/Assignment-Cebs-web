import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators'; // For modern pipe usage

// --- Primeng Imports (Keep all original ones) ---
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// --- Feature Imports (UPDATED) ---
import { InviteCreateDialogComponent } from './invite-create-dialog/invite-create-dialog.component'; // New Create Component
import { InviteUpdateDialogComponent } from './invite-update-dialog/invite-update-dialog.component'; // New Update Component
import { InvitationResponse } from '../../../core/models/invitation/invitation-response.model';
import { InvitationService } from '../../../core/services/domain/invitation.service';
import { InvitationStatusEnum } from '../../../core/enums/invitation/invitation-status.enum';
import { RoleEnum } from '../../../core/enums/role.enum';
import { TooltipModule } from 'primeng/tooltip';
import { PagedResult } from '../../../core/models/_pagination/paged-result-response.model';
import { RevokeInvitationRequestModel } from '../../../core/models/invitation/revoke-invitation-request.model';
import { animation } from '@angular/animations';
import { InvitationWithTitlesResponseModel } from '../../../core/models/invitation/invitation-with-titles-response.model';

@Component({
    selector: 'app-invite-management',
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
        InviteCreateDialogComponent,
        InviteUpdateDialogComponent
    ],
    templateUrl: './invite-management.component.html',
    styleUrl: './invite-management.component.scss',
    providers: [InvitationService, ConfirmationService]
})
export class InviteManagementComponent implements OnInit {


    // --- State Signals (Modern Angular) ---
    invites = signal<InvitationWithTitlesResponseModel[]>([]);
    isLoading = signal(false);
    selectedInvites = signal<InvitationWithTitlesResponseModel[] | null>(null);

    // --- Dialog Management State ---
    isCreateDialogOpen = signal(false);
    isUpdateDialogOpen = signal(false);
    selectedInviteToEdit = signal<InvitationWithTitlesResponseModel | null>(null);

    @ViewChild('dt') dt!: Table;

    constructor(
        public inviteService: InvitationService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.loadInvitations();
    }

    onPageChange(event: any) {
        const pageNumber = Math.floor(event.first / event.rows) + 1; // correct page number
        this.inviteService.pageNumber.set(pageNumber);
        this.inviteService.pageSize.set(event.rows);

        this.loadInvitations();
    }


    loadInvitations() {
        this.isLoading.set(true);

        this.inviteService
            .getListWithTitles()
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (response: PagedResult<InvitationWithTitlesResponseModel>) => {
                    this.invites.set(response.items);
                    console.log('Total Count:', this.inviteService.totalCount());
                    console.log('Page Number:', this.inviteService.pageNumber());
                },
                error: (error) => {
                    console.error('Error fetching invites:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load invitations.',
                        life: 3000
                    });
                }
            });
    }


    deleteInvite(invite: InvitationWithTitlesResponseModel) {
        this.isLoading.set(true);
        this.confirmationService.confirm({
            message: `Are you sure you want to revoke the invite for ${invite.email}?`,
            header: 'Confirm Revocation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const request: RevokeInvitationRequestModel = { invitationId: invite.id! };
                this.inviteService.revoke(request).subscribe({
                    next: (updatedInvite: InvitationWithTitlesResponseModel) => {

                        this.invites.update(list =>
                            list.map(i => i.id === updatedInvite.id ? updatedInvite : i)
                        );
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Invitation Revoked' });
                        this.isLoading.set(false);

                    },
                    error: (err) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to revoke invitation.' });
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
    public isEditable(status: InvitationStatusEnum): boolean {
        return status === InvitationStatusEnum.Pending;
    }
    editInvite(invite: InvitationWithTitlesResponseModel) {
        this.selectedInviteToEdit.set(invite);
        this.isUpdateDialogOpen.set(true);
    }

    // --- Dialog Event Handlers ---

    onInviteCreated() {
        this.loadInvitations(); // Refresh the list
    }

    onInviteUpdated() {
        this.loadInvitations(); // Refresh the list
    }

    onUpdateDialogHide() {
        this.isUpdateDialogOpen.set(false);
        this.selectedInviteToEdit.set(null);
    }

    // --- Utility Methods ---


    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }


    getSeverity(status: InvitationStatusEnum) {
        switch (status) {
            case InvitationStatusEnum.Pending:
                return 'info';
            case InvitationStatusEnum.Accepted:
                return 'success';
            case InvitationStatusEnum.Revoked:
                return 'warn';
            default:
                return 'info';
        }
    }

    getStatusText(status: InvitationStatusEnum) {
        return InvitationStatusEnum[status];
    }
    getRoleText(status: RoleEnum) {
        return RoleEnum[status];
    }
}
