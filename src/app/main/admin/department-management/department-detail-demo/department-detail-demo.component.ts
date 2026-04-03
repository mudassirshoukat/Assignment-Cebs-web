import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// If you're using RouterLink in breadcrumb
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-department-detail',
imports: [
    // Angular Common
    CommonModule,
    FormsModule,
    RouterModule, // Only if using routerLink in breadcrumb
    
    // PrimeNG Modules
    CardModule,
    TabViewModule,
    TagModule,
    BadgeModule,
    ButtonModule,
    AvatarModule,
    ProgressBarModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    MenuModule,
    CheckboxModule,
    ProgressSpinnerModule
  ],  templateUrl: './department-detail-demo.component.html',
  styleUrl: './department-detail-demo.component.scss'
})

export class DepartmentDetailDemoComponent implements OnInit {
  
  // Department data
  department: any;
  departmentStats: any;
  departmentHead: any;
  
  // Job Titles
  jobTitles: any[] = [];
  filteredJobTitles: any[] = [];
  jobTitleSearch: string = '';
  
  // Employees
  employees: any[] = [];
  designationFilterOptions: any[] = [];
  
  // Recent Activity
  recentActivities: any[] = [];
  
  // Designation Distribution
  designationDistribution: any[] = [];
  
  // Settings
  defaultWorkHours: string = '9-6';
  defaultMeetingDay: string = 'Monday';
  canCreateProjects: boolean = true;
  canHireEmployees: boolean = true;
  requiresApproval: boolean = false;
  
  // Dropdown Options
  workHourOptions = [
    { label: '9:00 AM - 6:00 PM', value: '9-6' },
    { label: '8:00 AM - 5:00 PM', value: '8-5' },
    { label: 'Flexible Hours', value: 'flexible' },
    { label: 'Remote Flexible', value: 'remote-flex' }
  ];
  
  meetingDayOptions = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' }
  ];
  
  otherDepartments = [
    { label: 'Product Management', value: 'product' },
    { label: 'Quality Assurance', value: 'qa' },
    { label: 'Design', value: 'design' },
    { label: 'Operations', value: 'operations' }
  ];
  
  // More menu items
  moreMenuItems = [
    { label: 'Export Department Data', icon: 'pi pi-download' },
    { label: 'Duplicate Department', icon: 'pi pi-copy' },
    { label: 'Print Details', icon: 'pi pi-print' },
    { separator: true },
    { label: 'Archive Department', icon: 'pi pi-archive' }
  ];

  constructor() {}

  ngOnInit() {
    this.loadDummyData();
  }

  loadDummyData() {
    // Department data
    this.department = {
      id: 1,
      publicId: 'DEP-1001',
      code: 'ENG-001',
      name: 'Engineering Department',
      description: 'The Engineering Department is responsible for developing and maintaining all software products, ensuring technical excellence, and driving innovation across the organization.',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date()
    };

    // Department statistics
    this.departmentStats = {
      jobTitleCount: 8,
      activeJobTitles: 7,
      employeeCount: 42,
      activeProjects: 12,
      mainProjects: 8,
      teamLeads: 6,
      projectManagers: 4
    };

    // Department head
    this.departmentHead = {
      initials: 'JS',
      name: 'John Smith',
      email: 'john.smith@company.com',
      designation: 'Director of Engineering',
      color: '#3b82f6'
    };

    // Job Titles
    this.jobTitles = [
      {
        id: 1,
        name: 'Software Engineer',
        code: 'SE',
        isActive: true,
        employeeCount: 15,
        commonDesignations: ['Junior', 'Mid-level', 'Senior'],
        createdAt: new Date('2024-01-20')
      },
      {
        id: 2,
        name: 'Senior Software Engineer',
        code: 'SSE',
        isActive: true,
        employeeCount: 8,
        commonDesignations: ['Senior', 'Lead'],
        createdAt: new Date('2024-01-20')
      },
      {
        id: 3,
        name: 'Frontend Developer',
        code: 'FED',
        isActive: true,
        employeeCount: 6,
        commonDesignations: ['Junior', 'Mid-level', 'Senior'],
        createdAt: new Date('2024-02-10')
      },
      {
        id: 4,
        name: 'Backend Developer',
        code: 'BED',
        isActive: true,
        employeeCount: 7,
        commonDesignations: ['Mid-level', 'Senior'],
        createdAt: new Date('2024-02-10')
      },
      {
        id: 5,
        name: 'DevOps Engineer',
        code: 'DOE',
        isActive: true,
        employeeCount: 4,
        commonDesignations: ['Mid-level', 'Senior'],
        createdAt: new Date('2024-03-05')
      },
      {
        id: 6,
        name: 'QA Engineer',
        code: 'QAE',
        isActive: true,
        employeeCount: 5,
        commonDesignations: ['Junior', 'Mid-level'],
        createdAt: new Date('2024-03-15')
      },
      {
        id: 7,
        name: 'Technical Architect',
        code: 'TA',
        isActive: true,
        employeeCount: 2,
        commonDesignations: ['Senior', 'Principal'],
        createdAt: new Date('2024-04-01')
      },
      {
        id: 8,
        name: 'Mobile Developer',
        code: 'MD',
        isActive: false,
        employeeCount: 0,
        commonDesignations: ['Junior', 'Mid-level'],
        createdAt: new Date('2024-04-20')
      }
    ];
    this.filteredJobTitles = [...this.jobTitles];

    // Employees dummy data
    this.employees = [
      {
        id: 1,
        initials: 'JS',
        name: 'John Smith',
        email: 'john@company.com',
        jobTitle: 'Software Engineer',
        designation: 'Senior',
        isActive: true,
        joinDate: new Date('2023-05-15'),
        color: '#3b82f6'
      },
      {
        id: 2,
        initials: 'MJ',
        name: 'Maria Johnson',
        email: 'maria@company.com',
        jobTitle: 'Frontend Developer',
        designation: 'Mid-level',
        isActive: true,
        joinDate: new Date('2023-08-20'),
        color: '#8b5cf6'
      },
      {
        id: 3,
        initials: 'RK',
        name: 'Robert Kim',
        email: 'robert@company.com',
        jobTitle: 'Backend Developer',
        designation: 'Senior',
        isActive: true,
        joinDate: new Date('2022-11-10'),
        color: '#10b981'
      },
      {
        id: 4,
        initials: 'ED',
        name: 'Emma Davis',
        email: 'emma@company.com',
        jobTitle: 'DevOps Engineer',
        designation: 'Mid-level',
        isActive: true,
        joinDate: new Date('2024-01-15'),
        color: '#f59e0b'
      },
      {
        id: 5,
        initials: 'TW',
        name: 'Tom Wilson',
        email: 'tom@company.com',
        jobTitle: 'QA Engineer',
        designation: 'Junior',
        isActive: true,
        joinDate: new Date('2024-03-01'),
        color: '#ef4444'
      }
    ];

    // Designation filter options
    this.designationFilterOptions = [
      { label: 'All Designations', value: null },
      { label: 'Junior', value: 'Junior' },
      { label: 'Mid-level', value: 'Mid-level' },
      { label: 'Senior', value: 'Senior' },
      { label: 'Lead', value: 'Lead' },
      { label: 'Principal', value: 'Principal' }
    ];

    // Recent activities
    this.recentActivities = [
      {
        userInitials: 'JS',
        description: 'Added new job title: Mobile Developer',
        timestamp: new Date('2024-11-20T10:30:00'),
        color: '#3b82f6'
      },
      {
        userInitials: 'AD',
        description: 'Updated department description',
        timestamp: new Date('2024-11-19T14:20:00'),
        color: '#8b5cf6'
      },
      {
        userInitials: 'HR',
        description: 'Assigned 3 new employees to department',
        timestamp: new Date('2024-11-18T09:15:00'),
        color: '#10b981'
      },
      {
        userInitials: 'JS',
        description: 'Changed department head to John Smith',
        timestamp: new Date('2024-11-17T16:45:00'),
        color: '#3b82f6'
      },
      {
        userInitials: 'SM',
        description: 'Created new project: E-commerce Platform',
        timestamp: new Date('2024-11-16T11:30:00'),
        color: '#f59e0b'
      }
    ];

    // Designation distribution
    this.designationDistribution = [
      { designation: 'Junior', count: 8, percentage: 19 },
      { designation: 'Mid-level', count: 18, percentage: 43 },
      { designation: 'Senior', count: 12, percentage: 29 },
      { designation: 'Lead', count: 3, percentage: 7 },
      { designation: 'Principal', count: 1, percentage: 2 }
    ];
  }

  // Helper methods
  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatRelativeTime(date: Date): string {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return this.formatDate(date);
  }

  getDesignationSeverity(designation: string): string {
    switch (designation?.toLowerCase()) {
      case 'junior': return 'info';
      case 'mid-level': return 'success';
      case 'senior': return 'warning';
      case 'lead': return 'danger';
      case 'principal': return 'help';
      default: return 'info';
    }
  }

  // Event handlers
  editDepartment() {
    console.log('Edit department:', this.department.id);
  }

  addJobTitle() {
    console.log('Add new job title for department:', this.department.id);
  }

  // Filter job titles based on search
  filterJobTitles() {
    if (!this.jobTitleSearch) {
      this.filteredJobTitles = [...this.jobTitles];
      return;
    }
    
    const searchTerm = this.jobTitleSearch.toLowerCase();
    this.filteredJobTitles = this.jobTitles.filter(jt =>
      jt.name.toLowerCase().includes(searchTerm) ||
      (jt.code && jt.code.toLowerCase().includes(searchTerm))
    );
  }
}