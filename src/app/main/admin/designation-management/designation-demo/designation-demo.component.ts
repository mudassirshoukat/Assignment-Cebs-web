import { CommonModule } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform, signal, ViewChild } from '@angular/core';
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
import { DesignationCreateDialogComponent } from '../designation-create-dialog/designation-create-dialog.component';


// Custom Pipe for filtering by level
@Pipe({
  name: 'filterByLevel',
  standalone: true
})
export class FilterByLevelPipe implements PipeTransform {
  transform(designations: any[], level: string): any[] {
    if (!designations) return [];

    const levelRanges: any = {
      'executive': [1, 3],    // Rank 1-3: Executive
      'management': [4, 6],   // Rank 4-6: Management
      'contributor': [7, 10]  // Rank 7-10: Individual Contributors
    };

    const [min, max] = levelRanges[level] || [1, 10];
    return designations.filter(d => d.rank >= min && d.rank <= max);
  }
}

@Component({
  selector: 'app-designation-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterByLevelPipe,
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
  templateUrl: './designation-demo.component.html',
  styleUrl: './designation-demo.component.scss'
})
export class DesignationDemoComponent implements OnInit {
  openNew() {
    this.isCreateDialogOpen.set(true);
  }

  // Designations Data
  designations: any[] = [];
  filteredDesignations: any[] = [];
  sortedDesignations: any[] = [];

  // Filters
  showFilters: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = 'all';
  statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active Only', value: 'active' },
    { label: 'Inactive Only', value: 'inactive' }
  ];

  // Statistics
  designationStats: any;

  // Dialog
  isCreateDialogOpen = signal(false);
  isUpdateDialogOpen = signal(false);
  selectedDesignationToEdit = signal<any | null>(null);

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

  constructor() {
  }

  ngOnInit() {
    this.loadDummyData();
    this.applyFilters();
  }

  loadDummyData() {
    // Real-world designations hierarchy (Rank 1 = highest authority)
    this.designations = [
      // Executive Level (Rank 1-3)
      {
        id: 1,
        publicId: 'DES-1001',
        name: 'Chief Executive Officer',
        rank: 1,
        description: 'Highest executive authority, responsible for overall company strategy',
        canBeProjectManager: true,
        canBeTeamLead: true,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: true,
        canManageProjects: true,
        canManageEmployees: true,
        canReviewReports: true,
        isActive: true,
        employeeCount: 1,
        level: 'executive'
      },
      {
        id: 2,
        publicId: 'DES-1002',
        name: 'Chief Technology Officer',
        rank: 2,
        description: 'Leads technology strategy and innovation',
        canBeProjectManager: true,
        canBeTeamLead: true,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: true,
        canManageProjects: true,
        canManageEmployees: true,
        canReviewReports: true,
        isActive: true,
        employeeCount: 1,
        level: 'executive'
      },
      {
        id: 3,
        publicId: 'DES-1003',
        name: 'Vice President',
        rank: 3,
        description: 'Senior executive overseeing multiple departments',
        canBeProjectManager: true,
        canBeTeamLead: true,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: true,
        canManageProjects: true,
        canManageEmployees: true,
        canReviewReports: true,
        isActive: true,
        employeeCount: 2,
        level: 'executive'
      },

      // Management Level (Rank 4-6)
      {
        id: 4,
        publicId: 'DES-1004',
        name: 'Director',
        rank: 4,
        description: 'Leads a department or major business unit',
        canBeProjectManager: true,
        canBeTeamLead: true,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: true,
        canManageProjects: true,
        canManageEmployees: true,
        canReviewReports: true,
        isActive: true,
        employeeCount: 3,
        level: 'management'
      },
      {
        id: 5,
        publicId: 'DES-1005',
        name: 'Senior Manager',
        rank: 5,
        description: 'Manages multiple teams or complex projects',
        canBeProjectManager: true,
        canBeTeamLead: true,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: true,
        canManageProjects: true,
        canManageEmployees: false,
        canReviewReports: true,
        isActive: true,
        employeeCount: 5,
        level: 'management'
      },
      {
        id: 6,
        publicId: 'DES-1006',
        name: 'Manager',
        rank: 6,
        description: 'Manages a single team or project',
        canBeProjectManager: true,
        canBeTeamLead: true,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: true,
        canManageProjects: false,
        canManageEmployees: false,
        canReviewReports: false,
        isActive: true,
        employeeCount: 8,
        level: 'management'
      },

      // Individual Contributors (Rank 7-10)
      {
        id: 7,
        publicId: 'DES-1007',
        name: 'Lead / Principal',
        rank: 7,
        description: 'Senior individual contributor with technical leadership',
        canBeProjectManager: true,
        canBeTeamLead: true,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: false,
        canManageProjects: false,
        canManageEmployees: false,
        canReviewReports: false,
        isActive: true,
        employeeCount: 12,
        level: 'contributor'
      },
      {
        id: 8,
        publicId: 'DES-1008',
        name: 'Senior',
        rank: 8,
        description: 'Experienced professional with significant expertise',
        canBeProjectManager: false,
        canBeTeamLead: false,
        canApproveTasks: true,
        canAssignTasks: true,
        canManageTeam: false,
        canManageProjects: false,
        canManageEmployees: false,
        canReviewReports: false,
        isActive: true,
        employeeCount: 25,
        level: 'contributor'
      },
      {
        id: 9,
        publicId: 'DES-1009',
        name: 'Mid-level',
        rank: 9,
        description: 'Competent professional with solid experience',
        canBeProjectManager: false,
        canBeTeamLead: false,
        canApproveTasks: false,
        canAssignTasks: true,
        canManageTeam: false,
        canManageProjects: false,
        canManageEmployees: false,
        canReviewReports: false,
        isActive: true,
        employeeCount: 35,
        level: 'contributor'
      },
      {
        id: 10,
        publicId: 'DES-1010',
        name: 'Junior / Employee',
        rank: 10,
        description: 'Entry-level or early-career professional',
        canBeProjectManager: false,
        canBeTeamLead: false,
        canApproveTasks: false,
        canAssignTasks: false,
        canManageTeam: false,
        canManageProjects: false,
        canManageEmployees: false,
        canReviewReports: false,
        isActive: true,
        employeeCount: 20,
        level: 'contributor'
      },
      {
        id: 11,
        publicId: 'DES-1011',
        name: 'Intern',
        rank: 11,
        description: 'Temporary trainee or student position',
        canBeProjectManager: false,
        canBeTeamLead: false,
        canApproveTasks: false,
        canAssignTasks: false,
        canManageTeam: false,
        canManageProjects: false,
        canManageEmployees: false,
        canReviewReports: false,
        isActive: false,
        employeeCount: 5,
        level: 'contributor'
      }
    ];

    // Calculate statistics
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

  applyFilters() {
    this.filteredDesignations = this.designations.filter(d => {
      const matchesSearch = !this.searchTerm ||
        d.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' ||
        (this.selectedStatus === 'active' && d.isActive) ||
        (this.selectedStatus === 'inactive' && !d.isActive);

      return matchesSearch && matchesStatus;
    });

    // Sort by rank for the matrix view
    this.sortedDesignations = [...this.filteredDesignations].sort((a, b) => a.rank - b.rank);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onDesignationCreated() {
    // this.loadDesignations(); // Refresh the list
  }

  // Designation Actions
  viewDesignation(designation: any) {
    console.log('View designation:', designation);
    // Navigate to designation detail page
  }

  deleteDesignation(designation: any) {
    if (designation.employeeCount > 0) {
      alert(`Cannot delete "${designation.name}" because it has ${designation.employeeCount} employees assigned. Consider deactivating instead.`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${designation.name}"?`)) {
      const index = this.designations.findIndex(d => d.id === designation.id);
      if (index !== -1) {
        this.designations.splice(index, 1);
        this.applyFilters();
        this.updateStats();
      }
    }
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
        label: 'Duplicate',
        icon: 'pi pi-copy',
        command: () => this.duplicateDesignation(designation)
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

  duplicateDesignation(designation: any) {
    const duplicated = {
      ...designation,
      id: this.designations.length + 1,
      publicId: `DES-${1000 + this.designations.length + 1}`,
      name: `${designation.name} (Copy)`,
      rank: this.getNextAvailableRank(),
      employeeCount: 0
    };

    this.designations.push(duplicated);
    this.applyFilters();
    this.updateStats();
  }

  toggleDesignationStatus(designation: any) {
    designation.isActive = !designation.isActive;
    this.applyFilters();
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