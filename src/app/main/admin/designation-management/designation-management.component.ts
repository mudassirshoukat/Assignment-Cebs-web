import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs';
import { DesignationLevelEnum } from '../../../core/enums/designation/designation-level.enum';
import { DesignationWithCountResponseModel } from '../../../core/models/designation/designation-with-count-response.model';
import { DesignationService } from '../../../core/services/domain/designation.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { DesignationCreateDialogComponent } from "./designation-create-dialog/designation-create-dialog.component";


@Component({
  selector: 'app-designation-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG
    CardModule,
    ButtonModule,
    DialogModule,
    SelectButtonModule,
    CheckboxModule,
    InputTextModule,
    InputNumberModule,
    MenuModule,
    TooltipModule,
    BadgeModule,
    AvatarModule,
    DesignationCreateDialogComponent
  ],
  templateUrl: './designation-management.component.html',
  styleUrls: ['./designation-management.component.scss']
})
export class DesignationManagementComponent implements OnInit {

  isLoading = signal(false);
  // Designations Data
  designations: DesignationWithCountResponseModel[] = [];
  DesignationLevelEnum = DesignationLevelEnum;
  // Filters
  showFilters: boolean = false;
  selectedStatus: boolean | null = null; // null = all, true = active, false = inactive
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Active Only', value: true },
    { label: 'Inactive Only', value: false }
  ];

  // Statistics
  designationStats: any;

  // Dialog
  isCreateDialogOpen = signal(false);
  isUpdateDialogOpen = signal(false);
  selectedDesignationToEdit = signal<DesignationWithCountResponseModel | null>(null);

  // Context Menu
  contextMenuItems: any[] = [];
  selectedContextDesignation: any = null;

  // Reference to the PrimeNG ContextMenu component
  // Make sure the template uses #contextMenu on the p-contextMenu element
  @ViewChild('contextMenu') contextMenu: any;

  // More Menu
  moreMenuItems = [
    { label: 'Export to CSV', icon: 'pi pi-download' },
    { label: 'Print Hierarchy', icon: 'pi pi-print' },
    { label: 'Import Designations', icon: 'pi pi-upload' },
    { separator: true },
    { label: 'Reset to Defaults', icon: 'pi pi-refresh' }
  ];

  constructor(
    private designationService: DesignationService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    this.designationService
      .getListAllWithCount()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: DesignationWithCountResponseModel[]) => {
          this.designations = response.sort((a, b) => a.rank - b.rank);

        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
    this.updateStats();

  }

  updateStats() {
    const activeDesignations = this.designations.filter(d => d.isActive);
    const totalEmployees = this.designations.reduce((sum, d) => sum + d.employeeCount, 0);
    const projectManagers = this.designations.filter(d => d.canBeProjectManager && d.isActive).length;
    const teamLeads = this.designations.filter(d => d.canBeTeamLead && d.isActive).length;

    this.designationStats = {
      total: this.designations.length,
      active: activeDesignations.length,
      totalEmployees: totalEmployees,
      avgEmployees: Math.round(totalEmployees / this.designations.length),
      projectManagers: projectManagers,
      teamLeads: teamLeads
    };
  }



  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  applyFilters() {

    this.designations = this.designations.filter(d => {

      const matchesStatus =
        this.selectedStatus === null ||
        (this.selectedStatus === true && d.isActive) ||
        (this.selectedStatus === false && !d.isActive);

      return matchesStatus;
    });

    // Sort by rank for the matrix view
    this.designations = [...this.designations].sort((a, b) => a.rank - b.rank);
  }

  getDesignationsByLevel(level: DesignationLevelEnum) {
    return this.designations
      .filter(d => d.level === level)
      .sort((a, b) => a.rank - b.rank);
  }


  openNew() {
    this.isCreateDialogOpen.set(true);
  }
  onDesignationCreated() {
    this.loadData(); // Refresh the list
  }

  // Designation Actions
  viewDesignation(designation: any) {
    console.log('View designation:', designation);
    // Navigate to designation detail page
  }



  // Context Menu
  openContextMenu(event: any, designation: any) {
    this.selectedContextDesignation = designation;
    this.contextMenuItems = this.getContextMenuItems(designation);
    this.contextMenu.toggle(event);
  }

  getContextMenuItems(designation: any) {
    return [
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => this.viewDesignation(designation)
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editDesignation(designation)
      },

      {
        separator: true
      },
      {
        label: designation.isActive ? 'Deactivate' : 'Activate',
        icon: designation.isActive ? 'pi pi-times' : 'pi pi-check',
        command: () => this.toggleDesignationStatus(designation)
      },
      {
        label: 'View Employees',
        icon: 'pi pi-users',
        command: () => this.viewEmployees(designation)
      }
    ];
  }


  toggleDesignationStatus(designation: any) {
    designation.isActive = !designation.isActive;
    this.updateStats();
  }

  viewEmployees(designation: any) {
    console.log('View employees with designation:', designation.name);
  }

  // Helper Methods
  getNextAvailableRank(): number {
    const maxRank = Math.max(...this.designations.map(d => d.rank));
    return maxRank + 1;
  }

  getLevelByRank(rank: number): string {
    if (rank <= 3) return 'executive';
    if (rank <= 6) return 'management';
    return 'contributor';
  }

  editDesignation(designation: any) {
    this.selectedDesignationToEdit.set(designation);
    this.isUpdateDialogOpen.set(true);
  }
}