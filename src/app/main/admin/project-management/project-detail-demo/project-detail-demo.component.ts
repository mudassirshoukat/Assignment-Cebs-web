import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { KnobModule } from 'primeng/knob';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail-demo.component.html',
  styleUrls: ['./project-detail-demo.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    
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
    ProgressSpinnerModule,
    KnobModule,
    MenuModule,
    TooltipModule
  ]
})
export class ProjectDetailDemoComponent implements OnInit {
  
  // Project data
  project: any;
  isLoading = false;
  
  // Tab loading states
  tasksTabLoaded = false;
  teamsTabLoaded = false;
  collaboratorsTabLoaded = false;
  
  // Tab data
  projectStats: any;
  mainTeam: any;
  taskStatusOverview: any;
  
  // Tasks tab
  tasks: any[] = [];
  filteredTasks: any[] = [];
  taskSearch = '';
  selectedTaskStatus: string="All";
  taskStatusOptions = [
    { label: 'All', value: null },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'In Review', value: 'inReview' },
    { label: 'Completed', value: 'completed' }
  ];
  
  // Teams tab
  projectTeams: any[] = [];
  
  // Collaborators tab
  collaborators: any[] = [];
  filteredCollaborators: any[] = [];
  collaboratorSearch = '';
  selectedTeamFilter: any;
  teamFilterOptions: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Simulate loading
    this.isLoading = true;
    
    setTimeout(() => {
      this.loadDummyData();
      this.isLoading = false;
    }, 500);
  }

  loadDummyData() {
    // Project data
    this.project = {
      id: 101,
      name: 'E-Commerce Platform',
      description: 'Build a modern e-commerce platform with React frontend and Node.js backend. Includes user authentication, product management, shopping cart, and payment integration.',
      status: 'In Progress',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-11-20'),
      manager: {
        initials: 'JS',
        name: 'John Smith',
        email: 'john.smith@company.com'
      },
      client: 'RetailCorp Inc.',
      priority: 'High',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      budget: 150000,
      currency: 'USD',
      tags: ['E-Commerce', 'React', 'Node.js', 'Payment Gateway'],
      progress: 68
    };

    // Project statistics
    this.projectStats = {
      totalTasks: 156,
      completedTasks: 106,
      totalTeams: 3,
      mainTeams: 1,
      totalMembers: 24
    };

    // Main team
    this.mainTeam = {
      id: 1,
      name: 'Frontend Development Team',
      description: 'Responsible for UI/UX development and frontend architecture',
      memberCount: 8,
      taskCount: 85
    };

    // Task status overview
    this.taskStatusOverview = {
      total: 156,
      todo: 28,
      inProgress: 42,
      inReview: 16,
      completed: 106
    };

    // Load overview tab data immediately
    this.tasksTabLoaded = false;
    this.teamsTabLoaded = false;
    this.collaboratorsTabLoaded = false;
    
    // Setup team filter options
    this.teamFilterOptions = [
      { id: 1, name: 'Frontend Team' },
      { id: 2, name: 'Backend Team' },
      { id: 3, name: 'QA Team' },
      { id: null, name: 'All Teams' }
    ];
    this.selectedTeamFilter = null;
  }

  // Tab change handler
  onTabChange(event: any) {
    const activeTabIndex = event.index;
          console.log('Active Tab Index:', activeTabIndex);

    switch (activeTabIndex) {
      case 1: // Tasks tab (index 1)
        if (!this.tasksTabLoaded) {
          this.loadDummyTasks();
        }
        break;
        
      case 2: // Teams tab (index 2)
        if (!this.teamsTabLoaded) {
          this.loadDummyTeams();
        }
        break;
        
      case 3: // Collaborators tab (index 3)
        if (!this.collaboratorsTabLoaded) {
          this.loadDummyCollaborators();
        }
        break;
    }
  }

  loadDummyTasks() {
    this.tasks = [
      {
        id: 1,
        title: 'Design Login Page',
        description: 'Create responsive login page with validation and social login options',
        assignee: { initials: 'JS', name: 'John Smith', color: '#3b82f6' },
        teamName: 'Frontend Team',
        status: 'inProgress',
        priority: 'High',
        dueDate: new Date('2024-12-15')
      },
      {
        id: 2,
        title: 'Implement Shopping Cart',
        description: 'Develop shopping cart functionality with add/remove items and quantity updates',
        assignee: { initials: 'MJ', name: 'Maria Johnson', color: '#8b5cf6' },
        teamName: 'Frontend Team',
        status: 'completed',
        priority: 'High',
        dueDate: new Date('2024-10-30')
      },
      {
        id: 3,
        title: 'Payment Gateway Integration',
        description: 'Integrate Stripe payment gateway with secure transaction handling',
        assignee: { initials: 'RK', name: 'Robert Kim', color: '#10b981' },
        teamName: 'Backend Team',
        status: 'inProgress',
        priority: 'High',
        dueDate: new Date('2024-12-20')
      },
      {
        id: 4,
        title: 'User Profile Management',
        description: 'Create user profile page with edit functionality and order history',
        assignee: { initials: 'ED', name: 'Emma Davis', color: '#f59e0b' },
        teamName: 'Frontend Team',
        status: 'todo',
        priority: 'Medium',
        dueDate: new Date('2024-12-10')
      },
      {
        id: 5,
        title: 'Product Search API',
        description: 'Build search API with filters and sorting options',
        assignee: { initials: 'TW', name: 'Tom Wilson', color: '#ef4444' },
        teamName: 'Backend Team',
        status: 'inReview',
        priority: 'Medium',
        dueDate: new Date('2024-11-25')
      },
      {
        id: 6,
        title: 'Mobile Responsive Design',
        description: 'Ensure all pages are fully responsive on mobile devices',
        assignee: { initials: 'SC', name: 'Sarah Chen', color: '#06b6d4' },
        teamName: 'Frontend Team',
        status: 'inProgress',
        priority: 'Medium',
        dueDate: new Date('2024-12-05')
      },
      {
        id: 7,
        title: 'Database Schema Design',
        description: 'Design and implement database schema for products and users',
        assignee: { initials: 'AG', name: 'Alex Garcia', color: '#8b5cf6' },
        teamName: 'Backend Team',
        status: 'completed',
        priority: 'High',
        dueDate: new Date('2024-09-15')
      },
      {
        id: 8,
        title: 'Unit Test Coverage',
        description: 'Write unit tests for critical components and APIs',
        assignee: { initials: 'LP', name: 'Lisa Park', color: '#ec4899' },
        teamName: 'QA Team',
        status: 'todo',
        priority: 'Low',
        dueDate: new Date('2024-12-28')
      }
    ];
    
    this.filteredTasks = [...this.tasks];
    this.tasksTabLoaded = true;
  }

  loadDummyTeams() {
    this.projectTeams = [
      {
        id: 1,
        name: 'Frontend Development Team',
        description: 'Responsible for UI/UX development using React and TypeScript',
        isMainTeam: true,
        memberCount: 8,
        taskCount: 85,
        progress: 75
      },
      {
        id: 2,
        name: 'Backend Development Team',
        description: 'Handles server-side logic, APIs, and database management',
        isMainTeam: false,
        memberCount: 6,
        taskCount: 52,
        progress: 65
      },
      {
        id: 3,
        name: 'Quality Assurance Team',
        description: 'Responsible for testing, bug reporting, and quality control',
        isMainTeam: false,
        memberCount: 4,
        taskCount: 19,
        progress: 40
      }
    ];
    
    this.teamsTabLoaded = true;
  }

  loadDummyCollaborators() {
    this.collaborators = [
      {
        id: 1,
        name: 'John Smith',
        initials: 'JS',
        email: 'john.smith@company.com',
        position: 'Senior Frontend Developer',
        color: '#3b82f6',
        teamName: 'Frontend Team',
        isMainTeam: true,
        role: 'Team Lead',
        taskCount: 12,
        completedTasks: 10,
        isActive: true
      },
      {
        id: 2,
        name: 'Maria Johnson',
        initials: 'MJ',
        email: 'maria.j@company.com',
        position: 'Frontend Developer',
        color: '#8b5cf6',
        teamName: 'Frontend Team',
        isMainTeam: true,
        role: 'Developer',
        taskCount: 15,
        completedTasks: 12,
        isActive: true
      },
      {
        id: 3,
        name: 'Robert Kim',
        initials: 'RK',
        email: 'robert.k@company.com',
        position: 'Backend Lead',
        color: '#10b981',
        teamName: 'Backend Team',
        isMainTeam: false,
        role: 'Team Lead',
        taskCount: 18,
        completedTasks: 15,
        isActive: true
      },
      {
        id: 4,
        name: 'Emma Davis',
        initials: 'ED',
        email: 'emma.d@company.com',
        position: 'UI/UX Designer',
        color: '#f59e0b',
        teamName: 'Frontend Team',
        isMainTeam: true,
        role: 'Designer',
        taskCount: 8,
        completedTasks: 6,
        isActive: true
      },
      {
        id: 5,
        name: 'Tom Wilson',
        initials: 'TW',
        email: 'tom.w@company.com',
        position: 'Backend Developer',
        color: '#ef4444',
        teamName: 'Backend Team',
        isMainTeam: false,
        role: 'Developer',
        taskCount: 14,
        completedTasks: 10,
        isActive: true
      },
      {
        id: 6,
        name: 'Sarah Chen',
        initials: 'SC',
        email: 'sarah.c@company.com',
        position: 'Frontend Developer',
        color: '#06b6d4',
        teamName: 'Frontend Team',
        isMainTeam: true,
        role: 'Developer',
        taskCount: 16,
        completedTasks: 13,
        isActive: true
      },
      {
        id: 7,
        name: 'Alex Garcia',
        initials: 'AG',
        email: 'alex.g@company.com',
        position: 'Database Administrator',
        color: '#8b5cf6',
        teamName: 'Backend Team',
        isMainTeam: false,
        role: 'DBA',
        taskCount: 10,
        completedTasks: 8,
        isActive: true
      },
      {
        id: 8,
        name: 'Lisa Park',
        initials: 'LP',
        email: 'lisa.p@company.com',
        position: 'QA Engineer',
        color: '#ec4899',
        teamName: 'QA Team',
        isMainTeam: false,
        role: 'Tester',
        taskCount: 7,
        completedTasks: 5,
        isActive: true
      },
      {
        id: 9,
        name: 'Mike Brown',
        initials: 'MB',
        email: 'mike.b@company.com',
        position: 'DevOps Engineer',
        color: '#6366f1',
        teamName: 'Backend Team',
        isMainTeam: false,
        role: 'DevOps',
        taskCount: 6,
        completedTasks: 4,
        isActive: true
      },
      {
        id: 10,
        name: 'David Lee',
        initials: 'DL',
        email: 'david.l@company.com',
        position: 'Junior Frontend Developer',
        color: '#14b8a6',
        teamName: 'Frontend Team',
        isMainTeam: true,
        role: 'Junior Developer',
        taskCount: 5,
        completedTasks: 3,
        isActive: true
      }
    ];
    
    this.filteredCollaborators = [...this.collaborators];
    this.collaboratorsTabLoaded = true;
  }

  // Filter tasks based on search and status
  filterTasks() {
    if (!this.tasks.length) return;
    
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.taskSearch || 
        task.title.toLowerCase().includes(this.taskSearch.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(this.taskSearch.toLowerCase()));
      
      const matchesStatus = !this.selectedTaskStatus || 
        task.status === this.selectedTaskStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  // Filter collaborators based on search
  filterCollaborators() {
    if (!this.collaborators.length) return;
    
    this.filteredCollaborators = this.collaborators.filter(collaborator => {
      const matchesSearch = !this.collaboratorSearch || 
        collaborator.name.toLowerCase().includes(this.collaboratorSearch.toLowerCase()) ||
        collaborator.email.toLowerCase().includes(this.collaboratorSearch.toLowerCase()) ||
        collaborator.position.toLowerCase().includes(this.collaboratorSearch.toLowerCase());
      
      const matchesTeam = !this.selectedTeamFilter || 
        collaborator.teamName === this.selectedTeamFilter;
      
      return matchesSearch && matchesTeam;
    });
  }

  // Helper methods
  getStatusSeverity(status: string): string {
    if (!status) return 'info';
    
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'in progress': return 'info';
      case 'on hold': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }

  getPrioritySeverity(priority: string): string {
    if (!priority) return 'info';
    
    switch (priority.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  }

  getTaskStatusSeverity(status: string): string {
    if (!status) return 'info';
    
    switch (status) {
      case 'todo': return 'secondary';
      case 'inProgress': return 'info';
      case 'inReview': return 'warning';
      case 'completed': return 'success';
      default: return 'info';
    }
  }

  getRoleSeverity(role: string): string {
    if (!role) return 'info';
    
    switch (role.toLowerCase()) {
      case 'team lead': return 'success';
      case 'manager': return 'danger';
      case 'developer': return 'info';
      case 'designer': return 'warning';
      case 'tester': return 'help';
      case 'dba': return 'danger';
      case 'devops': return 'info';
      default: return 'info';
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysRemaining(endDate: Date): number {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getBudgetUtilization(project: any): number {
    if (!project || !project.budget) return 0;
    // Dummy calculation - in real app, this would come from API
    return Math.round((project.progress * project.budget) / 100);
  }

  isTaskOverdue(dueDate: Date): boolean {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  }

  // Navigation methods (stubs for now)
  navigateToTeam(teamId: number) {
    console.log('Navigate to team:', teamId);
    // In real app: this.router.navigate(['/teams', teamId]);
  }

  editProject() {
    console.log('Edit project:', this.project.id);
  }

  addTask() {
    console.log('Add task to project:', this.project.id);
  }

  viewTask(taskId: number) {
    console.log('View task:', taskId);
  }

  editTask(taskId: number) {
    console.log('Edit task:', taskId);
  }

  // Handle team filter change
  onTeamFilterChange() {
    this.filterCollaborators();
  }
}