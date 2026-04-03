import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TeamMemberResponseModel } from '../../../../core/models/team-member/team-member-response.model';
import { TeamDetailResponseModel } from '../../../../core/models/team/team-detail-response.model';
import { TeamMemberRoleEnum } from '../../../../core/enums/team-member/team-member-role.enum';
import { BadgeModule } from 'primeng/badge';
import { TeamService } from '../../../../core/services/domain/team.service';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { ProgressBar } from "primeng/progressbar";
import { TabViewModule, TabView } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { KnobModule } from 'primeng/knob';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-team-detail',
  imports: [
    CommonModule,
    Card,
    BadgeModule,
    TableModule,
    ButtonModule,
    ProgressBar,
    TabView,
    TabViewModule,
    CardModule,
    TagModule,
    AvatarModule,
    KnobModule,
    TooltipModule,
    FormsModule
  ],
  templateUrl: './team-detail-demo.component.html',
  styleUrls: ['./team-detail-demo.component.scss'],
})
export class TeamDetailDemoComponent implements OnInit {
   getSeverity(role: TeamMemberRoleEnum): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
    switch (role) {
    
        // Leads get 'Info' (Blue) - distinct but not as prominent as the Manager
        case TeamMemberRoleEnum.Lead:
            return 'info';

        // Members get 'Warn' (Orange) or 'Secondary' (Gray) 
        // Note: Using 'warn' makes them stand out; 'secondary' is better if you have many members
        case TeamMemberRoleEnum.Member:
            return 'warn';

        default:
            return 'info';
    }
}

  @Input() teamId!: string;
  team!: TeamDetailResponseModel;
  lead: TeamMemberResponseModel | null = null;
  members: TeamMemberResponseModel[] = [];
  isLoading = true;
value60: number = 60;
  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teamId = id;
      this.loadTeamDetail();
    }
  }

  loadTeamDetail(): void {
    this.isLoading = true;
    this.teamService.getById(this.teamId).subscribe({
      next: (team) => {
        this.team = team;
        this.lead = team.members.find(m => m.teamRole === TeamMemberRoleEnum.Lead) || null;
        this.members = team.members.filter(m => m.teamRole === TeamMemberRoleEnum.Member);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading team detail:', err);
        this.isLoading = false;
      }
    });
  }

  getRoleLabel(role: TeamMemberRoleEnum): string {
    return TeamMemberRoleEnum[role];
  }

  formatDate(date: string | Date | undefined | null): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  
  
  teamMembers = [
    { initials: 'SC', name: 'Sarah Chen', role: 'Senior Developer', specialty: 'React', severity: 'success', 
      taskCount: 18, completionRate: 95, workload: 82, color: '#3b82f6' },
    { initials: 'MJ', name: 'Mike Johnson', role: 'UI Developer', specialty: 'Design System', severity: 'info', 
      taskCount: 15, completionRate: 88, workload: 75, color: '#8b5cf6' },
    { initials: 'RK', name: 'Robert Kim', role: 'Angular Developer', specialty: 'Performance', severity: 'warning', 
      taskCount: 22, completionRate: 91, workload: 90, color: '#f59e0b' },
    { initials: 'ED', name: 'Emma Davis', role: 'Frontend Developer', specialty: 'Testing', severity: 'danger', 
      taskCount: 12, completionRate: 85, workload: 68, color: '#ef4444' },
    { initials: 'TW', name: 'Tom Wilson', role: 'Junior Developer', specialty: 'Learning', severity: 'secondary', 
      taskCount: 8, completionRate: 78, workload: 65, color: '#6b7280' },
    { initials: 'LP', name: 'Lisa Park', role: 'UX Developer', specialty: 'Accessibility', severity: 'info', 
      taskCount: 14, completionRate: 92, workload: 72, color: '#06b6d4' },
    { initials: 'AG', name: 'Alex Garcia', role: 'Full Stack', specialty: 'APIs', severity: 'success', 
      taskCount: 20, completionRate: 89, workload: 85, color: '#10b981' }
  ];

  teamProjects = [
    { 
      name: 'E-Commerce Platform', 
      description: 'Modern e-commerce solution with React frontend',
      isMainTeam: true,
      status: 'In Progress',
      startDate: 'Mar 2024',
      endDate: 'Dec 2024',
      tasks: { total: 42, completed: 35, inProgress: 7 },
      progress: 83
    },
    { 
      name: 'Admin Dashboard', 
      description: 'Internal admin dashboard for operations team',
      isMainTeam: true,
      status: 'Active',
      startDate: 'Jan 2024',
      endDate: 'Aug 2024',
      tasks: { total: 28, completed: 20, inProgress: 8 },
      progress: 71
    },
    { 
      name: 'Mobile App Redesign', 
      description: 'Redesign of customer mobile application',
      isMainTeam: false,
      status: 'Planning',
      startDate: 'May 2024',
      endDate: 'Nov 2024',
      tasks: { total: 15, completed: 8, inProgress: 7 },
      progress: 53
    },
    { 
      name: 'Design System', 
      description: 'Component library for all company products',
      isMainTeam: false,
      status: 'Active',
      startDate: 'Feb 2024',
      endDate: 'Oct 2024',
      tasks: { total: 36, completed: 24, inProgress: 12 },
      progress: 67
    }
  ];
}

