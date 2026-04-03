import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-designation-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    ProgressBarModule
  ],
  templateUrl: './designation-detail.component.html',
  styleUrls: ['./designation-detail.component.scss']
})
export class DesignationDetailComponent implements OnInit {
  
  designation: any;
  departmentDistribution: any[] = [];
  hierarchySteps: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadDesignationData();
  }

  loadDesignationData() {
    // In real app, get ID from route and fetch from API
    this.designation = {
      id: 8,
      publicId: 'DES-1008',
      name: 'Senior Developer',
      rank: 8,
      level: 'Individual Contributor',
      description: 'Experienced professional with significant expertise in software development. Responsible for complex feature implementation and mentoring junior team members.',
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
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-10-20')
    };

    // Department distribution
    this.departmentDistribution = [
      { name: 'Engineering', count: 15 },
      { name: 'Product', count: 5 },
      { name: 'QA', count: 3 },
      { name: 'Design', count: 2 }
    ];

    // Hierarchy visualization
    this.hierarchySteps = [
      { rank: 1, name: 'CEO' },
      { rank: 2, name: 'CTO' },
      { rank: 3, name: 'VP' },
      { rank: 4, name: 'Director' },
      { rank: 5, name: 'Senior Manager' },
      { rank: 6, name: 'Manager' },
      { rank: 7, name: 'Lead' },
      { rank: 8, name: 'Senior' },
      { rank: 9, name: 'Mid-level' },
      { rank: 10, name: 'Junior' }
    ];
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  editDesignation() {
    console.log('Edit designation:', this.designation.id);
    // Navigate to edit page
  }
}