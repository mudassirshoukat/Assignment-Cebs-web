import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode } from 'primeng/api';

// PrimeNG
import { OrganizationChartModule } from 'primeng/organizationchart';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

// Models
import { ProgressSpinner } from "primeng/progressspinner";

@Component({
  selector: 'app-employee-hierarchy',
  standalone: true,
  imports: [
    CommonModule,
    OrganizationChartModule,
    CardModule,
    AvatarModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinner
],
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">Organization Hierarchy</h2>
          <p class="text-muted mb-0">View the organizational structure</p>
        </div>
        <div class="d-flex gap-2">
          <button pButton icon="pi pi-refresh" label="Refresh" 
                  class="p-button-outlined p-button-sm" (click)="loadHierarchy()"></button>
          <button pButton icon="pi pi-chevron-circle-up" label="Collapse All" 
                  class="p-button-outlined p-button-sm" (click)="collapseAll()"></button>
          <button pButton icon="pi pi-chevron-circle-down" label="Expand All" 
                  class="p-button-outlined p-button-sm" (click)="expandAll()"></button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-5">
        <p-progressSpinner styleClass="w-3rem h-3rem"></p-progressSpinner>
        <p class="text-muted mt-3">Loading organization hierarchy...</p>
      </div>

      <!-- Organization Chart -->
      <div *ngIf="!isLoading" class="card shadow-sm overflow-x-auto p-4">
        <p-organizationChart 
          [value]="orgTree" 
          [collapsible]="true"
          (onNodeSelect)="onNodeSelect($event)"
          selectionMode="single"
          [(selection)]="selectedNode">
          
          <ng-template let-node pTemplate="default">
            <div class="employee-card" (click)="selectNode(node)">
              <div class="avatar-container">
                <p-avatar 
                  [label]="node.data?.firstName?.[0]" 
                  shape="circle" 
                  size="large"
                  [style]="{'background-color': getAvatarColor(node.data?.designationRank), 'color': 'white'}">
                </p-avatar>
              </div>
              
              <div class="employee-info">
                <div class="employee-name">{{ node.label }}</div>
                <p-tag 
                  [value]="node.data?.designationName" 
                  [severity]="getTagSeverity(node.data?.designationRank)"
                  styleClass="designation-tag">
                </p-tag>
                
                <div class="employee-details" *ngIf="node.data?.jobTitleName || node.data?.departmentName">
                  <div *ngIf="node.data?.jobTitleName" class="job-title">{{ node.data?.jobTitleName }}</div>
                  <div *ngIf="node.data?.departmentName" class="department">{{ node.data?.departmentName }}</div>
                </div>
                
                <div class="employee-email small text-muted">{{ node.data?.email }}</div>
              </div>
              
              <!-- Expand/Collapse Indicator (handled by OrganizationChart) -->
            </div>
          </ng-template>
        </p-organizationChart>
      </div>

      <!-- Details Panel -->
      <div *ngIf="selectedNode?.data" class="mt-4">
        <p-card header="Employee Details" styleClass="shadow-sm">
          <div class="row">
            <div class="col-md-6">
              <div class="d-flex align-items-center mb-3">
                <p-avatar 
                  [label]="selectedNode?.data?.firstName?.[0]" 
                  shape="circle" 
                  size="xlarge"
                  [style]="{'background-color': getAvatarColor(selectedNode?.data?.designationRank), 'color': 'white', 'margin-right': '1rem'}">
                </p-avatar>
                <div>
                  <h4 class="fw-bold mb-1">{{ selectedNode?.data?.fullName }}</h4>
                  <p class="text-muted mb-0">{{ selectedNode?.data?.email }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="row g-3">
                <div class="col-sm-6">
                  <div class="small text-muted">Employee ID</div>
                  <div class="fw-bold">{{ selectedNode?.data?.publicId }}</div>
                </div>
                <div class="col-sm-6">
                  <div class="small text-muted">Designation</div>
                  <div>{{ selectedNode?.data?.designationName }} (Rank {{ selectedNode?.data?.designationRank }})</div>
                </div>
                <div class="col-sm-6" *ngIf="selectedNode?.data?.jobTitleName">
                  <div class="small text-muted">Job Title</div>
                  <div>{{ selectedNode?.data?.jobTitleName }}</div>
                </div>
                <div class="col-sm-6" *ngIf="selectedNode?.data?.departmentName">
                  <div class="small text-muted">Department</div>
                  <div>{{ selectedNode?.data?.departmentName }}</div>
                </div>
                <div class="col-sm-6">
                  <div class="small text-muted">Status</div>
                  <span class="badge" [ngClass]="selectedNode?.data?.isActive ? 'bg-success' : 'bg-secondary'">
                    {{ selectedNode?.data?.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .employee-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      min-width: 220px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .avatar-container {
      margin-bottom: 0.75rem;
    }
    
    .employee-info {
      text-align: center;
      width: 100%;
    }
    
    .employee-name {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .designation-tag {
      display: inline-block;
      margin-bottom: 0.5rem;
      font-size: 0.7rem;
    }
    
    .employee-details {
      font-size: 0.8rem;
      margin-bottom: 0.25rem;
    }
    
    .job-title {
      color: #495057;
      font-weight: 500;
    }
    
    .department {
      color: #6c757d;
      font-size: 0.75rem;
    }
    
    .employee-email {
      font-size: 0.7rem;
      color: #adb5bd;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    :host ::ng-deep {
      .p-organizationchart .p-organizationchart-node-content {
        padding: 0;
        border: none;
        background: transparent;
      }
      
      .p-organizationchart .p-organizationchart-line-down {
        background: #dee2e6;
      }
      
      .p-organizationchart .p-organizationchart-line-left,
      .p-organizationchart .p-organizationchart-line-right {
        border-color: #dee2e6;
      }
      
      .p-organizationchart-node-content.selected .employee-card {
        background-color: #e6f2ff;
        border-radius: 8px;
      }
    }
  `]
})
export class EmployeeHierarchyComponent implements OnInit {
  
  orgTree: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  isLoading = false;

  ngOnInit() {
    this.loadHierarchy();
  }

  loadHierarchy() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.orgTree = this.generateDummyHierarchy();
      this.isLoading = false;
    }, 1000);
  }

  onNodeSelect(event: any) {
    this.selectedNode = event.node;
  }

  selectNode(node: TreeNode) {
    this.selectedNode = node;
  }

  collapseAll() {
    // OrganizationChart handles collapsible internally
    // This is just a placeholder for the button
  }

  expandAll() {
    // OrganizationChart handles collapsible internally
    // This is just a placeholder for the button
  }

  getAvatarColor(rank: number): string {
    if (rank <= 3) return '#dc3545';      // Executive - Red
    if (rank <= 6) return '#fd7e14';      // Management - Orange
    if (rank <= 8) return '#0d6efd';      // Senior/Lead - Blue
    return '#198754';                      // Individual - Green
  }

  getTagSeverity(rank: number): string {
    if (rank <= 3) return 'danger';
    if (rank <= 6) return 'warning';
    if (rank <= 8) return 'info';
    return 'success';
  }

  private generateDummyHierarchy(): TreeNode[] {
    return [
      {
        label: 'Sarah Chen',
        data: {
          id: '1',
          publicId: 'EMP-1001',
          firstName: 'Sarah',
          lastName: 'Chen',
          fullName: 'Sarah Chen',
          email: 'sarah.chen@company.com',
          designationName: 'Chief Executive Officer',
          designationRank: 1,
          jobTitleName: undefined,
          departmentName: undefined,
          isActive: true
        },
        expanded: true,
        type: 'person',
        children: [
          {
            label: 'Michael Rodriguez',
            data: {
              id: '2',
              publicId: 'EMP-1002',
              firstName: 'Michael',
              lastName: 'Rodriguez',
              fullName: 'Michael Rodriguez',
              email: 'michael.r@company.com',
              designationName: 'Chief Technology Officer',
              designationRank: 2,
              jobTitleName: undefined,
              departmentName: undefined,
              isActive: true
            },
            expanded: true,
            type: 'person',
            children: [
              {
                label: 'Emily Chang',
                data: {
                  id: '5',
                  publicId: 'EMP-1005',
                  firstName: 'Emily',
                  lastName: 'Chang',
                  fullName: 'Emily Chang',
                  email: 'emily.c@company.com',
                  designationName: 'Director of Engineering',
                  designationRank: 4,
                  jobTitleName: 'Director of Engineering',
                  departmentName: 'Engineering',
                  isActive: true
                },
                expanded: false,
                type: 'person',
                children: [
                  {
                    label: 'Kevin Zhang',
                    data: {
                      id: '9',
                      publicId: 'EMP-1009',
                      firstName: 'Kevin',
                      lastName: 'Zhang',
                      fullName: 'Kevin Zhang',
                      email: 'kevin.z@company.com',
                      designationName: 'Engineering Manager',
                      designationRank: 6,
                      jobTitleName: 'Engineering Manager',
                      departmentName: 'Engineering',
                      isActive: true
                    },
                    expanded: false,
                    type: 'person',
                    children: [
                      {
                        label: 'Ross Geller',
                        data: {
                          id: '13',
                          publicId: 'EMP-1013',
                          firstName: 'Ross',
                          lastName: 'Geller',
                          fullName: 'Ross Geller',
                          email: 'ross.g@company.com',
                          designationName: 'Senior Software Engineer',
                          designationRank: 8,
                          jobTitleName: 'Senior Software Engineer',
                          departmentName: 'Engineering',
                          isActive: true
                        },
                        type: 'person',
                        leaf: true,
                      },
                      {
                        label: 'Chandler Bing',
                        data: {
                          id: '14',
                          publicId: 'EMP-1014',
                          firstName: 'Chandler',
                          lastName: 'Bing',
                          fullName: 'Chandler Bing',
                          email: 'chandler.b@company.com',
                          designationName: 'Software Engineer',
                          designationRank: 9,
                          jobTitleName: 'Software Engineer',
                          departmentName: 'Engineering',
                          isActive: true
                        },
                        type: 'person',
                        leaf: true,
                      }
                    ]
                  },
                  {
                    label: 'Rachel Green',
                    data: {
                      id: '10',
                      publicId: 'EMP-1010',
                      firstName: 'Rachel',
                      lastName: 'Green',
                      fullName: 'Rachel Green',
                      email: 'rachel.g@company.com',
                      designationName: 'Engineering Manager',
                      designationRank: 6,
                      jobTitleName: 'Engineering Manager',
                      departmentName: 'Engineering',
                      isActive: true
                    },
                    expanded: false,
                    type: 'person',
                    children: [
                      {
                        label: 'Joey Tribbiani',
                        data: {
                          id: '15',
                          publicId: 'EMP-1015',
                          firstName: 'Joey',
                          lastName: 'Tribbiani',
                          fullName: 'Joey Tribbiani',
                          email: 'joey.t@company.com',
                          designationName: 'Junior Developer',
                          designationRank: 10,
                          jobTitleName: 'Junior Developer',
                          departmentName: 'Engineering',
                          isActive: true
                        },
                        type: 'person',
                        leaf: true,
                      }
                    ]
                  }
                ]
              },
              {
                label: 'James Wilson',
                data: {
                  id: '6',
                  publicId: 'EMP-1006',
                  firstName: 'James',
                  lastName: 'Wilson',
                  fullName: 'James Wilson',
                  email: 'james.w@company.com',
                  designationName: 'Director of Product',
                  designationRank: 4,
                  jobTitleName: 'Director of Product',
                  departmentName: 'Product',
                  isActive: true
                },
                expanded: false,
                type: 'person',
                children: [
                  {
                    label: 'Monica Geller',
                    data: {
                      id: '11',
                      publicId: 'EMP-1011',
                      firstName: 'Monica',
                      lastName: 'Geller',
                      fullName: 'Monica Geller',
                      email: 'monica.g@company.com',
                      designationName: 'Product Manager',
                      designationRank: 6,
                      jobTitleName: 'Product Manager',
                      departmentName: 'Product',
                      isActive: true
                    },
                    expanded: false,
                    type: 'person',
                    children: [
                      {
                        label: 'Janice Litman',
                        data: {
                          id: '16',
                          publicId: 'EMP-1016',
                          firstName: 'Janice',
                          lastName: 'Litman',
                          fullName: 'Janice Litman',
                          email: 'janice.l@company.com',
                          designationName: 'Product Analyst',
                          designationRank: 9,
                          jobTitleName: 'Product Analyst',
                          departmentName: 'Product',
                          isActive: true
                        },
                        type: 'person',
                        leaf: true,
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            label: 'Jennifer Williams',
            data: {
              id: '3',
              publicId: 'EMP-1003',
              firstName: 'Jennifer',
              lastName: 'Williams',
              fullName: 'Jennifer Williams',
              email: 'jennifer.w@company.com',
              designationName: 'Chief Financial Officer',
              designationRank: 2,
              jobTitleName: undefined,
              departmentName: undefined,
              isActive: true
            },
            expanded: false,
            type: 'person',
            children: [
              {
                label: 'Robert Martinez',
                data: {
                  id: '7',
                  publicId: 'EMP-1007',
                  firstName: 'Robert',
                  lastName: 'Martinez',
                  fullName: 'Robert Martinez',
                  email: 'robert.m@company.com',
                  designationName: 'Director of Finance',
                  designationRank: 4,
                  jobTitleName: 'Director of Finance',
                  departmentName: 'Finance',
                  isActive: true
                },
                type: 'person',
                leaf: true,
              }
            ]
          },
          {
            label: 'David Thompson',
            data: {
              id: '4',
              publicId: 'EMP-1004',
              firstName: 'David',
              lastName: 'Thompson',
              fullName: 'David Thompson',
              email: 'david.t@company.com',
              designationName: 'Chief Operating Officer',
              designationRank: 2,
              jobTitleName: undefined,
              departmentName: undefined,
              isActive: true
            },
            expanded: false,
            type: 'person',
            children: [
              {
                label: 'Maria Garcia',
                data: {
                  id: '8',
                  publicId: 'EMP-1008',
                  firstName: 'Maria',
                  lastName: 'Garcia',
                  fullName: 'Maria Garcia',
                  email: 'maria.g@company.com',
                  designationName: 'Director of HR',
                  designationRank: 4,
                  jobTitleName: 'Director of HR',
                  departmentName: 'Human Resources',
                  isActive: true
                },
                expanded: false,
                type: 'person',
                children: [
                  {
                    label: 'Phoebe Buffay',
                    data: {
                      id: '12',
                      publicId: 'EMP-1012',
                      firstName: 'Phoebe',
                      lastName: 'Buffay',
                      fullName: 'Phoebe Buffay',
                      email: 'phoebe.b@company.com',
                      designationName: 'HR Manager',
                      designationRank: 6,
                      jobTitleName: 'HR Manager',
                      departmentName: 'Human Resources',
                      isActive: true
                    },
                    expanded: false,
                    type: 'person',
                    children: [
                      {
                        label: 'Gunther Central',
                        data: {
                          id: '17',
                          publicId: 'EMP-1017',
                          firstName: 'Gunther',
                          lastName: 'Central',
                          fullName: 'Gunther Central',
                          email: 'gunther.c@company.com',
                          designationName: 'HR Specialist',
                          designationRank: 9,
                          jobTitleName: 'HR Specialist',
                          departmentName: 'Human Resources',
                          isActive: true
                        },
                        type: 'person',
                        leaf: true,
                      
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }
}













// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TreeNode } from 'primeng/api';

// // PrimeNG
// import { CardModule } from 'primeng/card';
// import { ButtonModule } from 'primeng/button';
// import { AvatarModule } from 'primeng/avatar';
// import { TagModule } from 'primeng/tag';
// import { TooltipModule } from 'primeng/tooltip';
// import { ProgressSpinnerModule } from 'primeng/progressspinner';
// import { ScrollPanelModule } from 'primeng/scrollpanel';
// import { EmployeeNodeModel, EmployeeOrgNode } from '../../../../core/models/employee/employee-with-titles-response.model';
// import { HierarchyNodeComponent } from "./hierarchy-node/hierarchy-node.component";

// // Models

// @Component({
//   selector: 'app-employee-hierarchy',
//   standalone: true,
//   imports: [
//     CommonModule,
//     CardModule,
//     ButtonModule,
//     AvatarModule,
//     TagModule,
//     TooltipModule,
//     ProgressSpinnerModule,
//     ScrollPanelModule,
//     HierarchyNodeComponent
// ],
//   templateUrl: './employee-hierarchy.component.html',
//   styleUrl: './employee-hierarchy.component.scss'
// })
// export class EmployeeHierarchyComponent implements OnInit {

//   // Tree data
//   orgTree: EmployeeOrgNode[] = [];

//   // Selected node (for details panel)
//   selectedNode: EmployeeOrgNode | null = null;

//   // Loading state
//   isLoading = false;

//   // Track expanded nodes
//   expandedNodes = new Set<string>();

//   constructor() {}

//   ngOnInit() {
//     this.loadInitialHierarchy();
//   }

//   /**
//    * Load initial hierarchy data
//    */
//   loadInitialHierarchy() {
//     this.isLoading = true;

//     // Simulate API call with dummy data
//     setTimeout(() => {
//       this.orgTree = this.generateDummyHierarchy();
//       // Auto-expand CEO and direct reports
//       this.expandedNodes.add('1'); // CEO
//       this.expandedNodes.add('2'); // CTO
//       this.expandedNodes.add('3'); // CFO
//       this.expandedNodes.add('4'); // COO
//       this.isLoading = false;
//     }, 1000);
//   }

//   /**
//    * Toggle node expansion
//    */
//   toggleNode(node: EmployeeOrgNode, event?: Event) {
//     if (event) {
//       event.stopPropagation();
//     }

//     if (this.expandedNodes.has(node.key!)) {
//       this.expandedNodes.delete(node.key!);
//     } else {
//       this.expandedNodes.add(node.key!);

//       // Lazy load children if not already loaded
//       if (node.data?.hasDirectReports && (!node.children || node.children.length === 0)) {
//         this.loadNodeChildren(node);
//       }
//     }
//   }

//   /**
//    * Lazy load children when a node is expanded
//    */
//   loadNodeChildren(node: EmployeeOrgNode) {
//     if (node.children && node.children.length > 0) {
//       return;
//     }

//     if (node.data?.hasDirectReports) {
//       // Simulate API call to fetch direct reports
//       setTimeout(() => {
//         node.children = this.generateChildrenForNode(node);
//         // Trigger change detection
//         this.orgTree = [...this.orgTree];
//       }, 800);
//     }
//   }

//   /**
//    * Check if node is expanded
//    */
//   isExpanded(node: EmployeeOrgNode): boolean {
//     return this.expandedNodes.has(node.key!);
//   }

//   /**
//    * Handle node selection
//    */
//   selectNode(node: EmployeeOrgNode, event?: Event) {
//     if (event) {
//       event.stopPropagation();
//     }
//     this.selectedNode = node;
//   }

//   /**
//    * Get display title for employee
//    */
//   getEmployeeTitle(emp: EmployeeNodeModel): string {
//     const parts: string[] = [];

//     if (emp.jobTitleName) {
//       parts.push(emp.jobTitleName);
//     }

//     if (emp.departmentName) {
//       parts.push(emp.departmentName);
//     }

//     return parts.length > 0 ? parts.join(' · ') : 'Executive';
//   }

//   // ==================== DUMMY DATA GENERATION ====================

//   private generateDummyHierarchy(): EmployeeOrgNode[] {
//     // Level 0: CEO (only one root node typically)
//     const ceo: EmployeeOrgNode = {
//       key: '1',
//       label: 'Sarah Chen',
//       data: {
//         id: '1',
//         publicId: 'EMP-1001',
//         userId: 'user-1',
//         firstName: 'Sarah',
//         lastName: 'Chen',
//         fullName: 'Sarah Chen',
//         email: 'sarah.chen@company.com',
//         designationId: '1',
//         designationName: 'Chief Executive Officer',
//         designationRank: 1,
//         departmentName: undefined,
//         jobTitleName: undefined,
//         supervisorId: undefined,
//         isOrphen: false,
//         isActive: true,
//         hasDirectReports: true,
//         createdOn: new Date('2023-01-15').toString(),
//         lastModifiedOn: new Date().toString(),
//       },
//       icon: 'pi pi-star-fill',
//       expandedIcon: 'pi pi-star-fill',
//       collapsedIcon: 'pi pi-star',
//       children: this.generateDirectReportsForCEO(),
//       expanded: true, // Keep CEO expanded to show first level
//       leaf: false,
//       selectable: true
//     };

//     return [ceo];
//   }

//   private generateDirectReportsForCEO(): EmployeeOrgNode[] {
//     // Level 1: Direct reports to CEO (C-Level executives)
//     return [
//       {
//         key: '2',
//         label: 'Michael Rodriguez',
//         data: {
//           id: '2',
//           publicId: 'EMP-1002',
//           userId: 'user-2',
//           firstName: 'Michael',
//           lastName: 'Rodriguez',
//           fullName: 'Michael Rodriguez',
//           email: 'michael.r@company.com',
//           designationId: '2',
//           designationName: 'Chief Technology Officer',
//           designationRank: 2,
//           departmentName: undefined,
//           jobTitleName: undefined,
//           supervisorId: '1',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-02-10').toString(),
//           lastModifiedOn: new Date().toString(),
//         },
//         icon: 'pi pi-desktop',
//         leaf: false,
//         selectable: true
//       },
//       {
//         key: '3',
//         label: 'Jennifer Williams',
//         data: {
//           id: '3',
//           publicId: 'EMP-1003',
//           userId: 'user-3',
//           firstName: 'Jennifer',
//           lastName: 'Williams',
//           fullName: 'Jennifer Williams',
//           email: 'jennifer.w@company.com',
//           designationId: '3',
//           designationName: 'Chief Financial Officer',
//           designationRank: 2,
//           departmentName: undefined,
//           jobTitleName: undefined,
//           supervisorId: '1',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-02-15').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-chart-line',
//         leaf: false,
//         selectable: true
//       },
//       {
//         key: '4',
//         label: 'David Thompson',
//         data: {
//           id: '4',
//           publicId: 'EMP-1004',
//           userId: 'user-4',
//           firstName: 'David',
//           lastName: 'Thompson',
//           fullName: 'David Thompson',
//           email: 'david.t@company.com',
//           designationId: '4',
//           designationName: 'Chief Operating Officer',
//           designationRank: 2,
//           departmentName: undefined,
//           jobTitleName: undefined,
//           supervisorId: '1',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-03-01').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-cog',
//         leaf: false,
//         selectable: true
//       }
//     ];
//   }

//   private generateChildrenForNode(node: EmployeeOrgNode): EmployeeOrgNode[] {
//     const nodeData = node.data;
//     if (!nodeData) return [];

//     // Generate children based on the node's designation
//     switch (nodeData.designationName) {
//       case 'Chief Technology Officer':
//         return this.generateCTODirectReports();
//       case 'Chief Financial Officer':
//         return this.generateCFODirectReports();
//       case 'Chief Operating Officer':
//         return this.generateCOODirectReports();
//       case 'Director of Engineering':
//         return this.generateEngineeringDirectReports();
//       case 'Director of Product':
//         return this.generateProductDirectReports();
//       case 'Engineering Manager':
//         return this.generateEMDirectReports();
//       case 'Product Manager':
//         return this.generatePMDirectReports();
//       default:
//         // If no children, return empty array and mark as leaf
//         node.leaf = true;
//         return [];
//     }
//   }

//   private generateCTODirectReports(): EmployeeOrgNode[] {
//     return [
//       {
//         key: '5',
//         label: 'Emily Chang',
//         data: {
//           id: '5',
//           publicId: 'EMP-1005',
//           userId: 'user-5',
//           firstName: 'Emily',
//           lastName: 'Chang',
//           fullName: 'Emily Chang',
//           email: 'emily.c@company.com',
//           designationId: '5',
//           designationName: 'Director of Engineering',
//           designationRank: 4,
//           departmentId: '1',
//           departmentName: 'Engineering',
//           jobTitleId: '10',
//           jobTitleName: 'Director of Engineering',
//           supervisorId: '2',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-04-10').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-code',
//         leaf: false,
//         selectable: true
//       },
//       {
//         key: '6',
//         label: 'James Wilson',
//         data: {
//           id: '6',
//           publicId: 'EMP-1006',
//           userId: 'user-6',
//           firstName: 'James',
//           lastName: 'Wilson',
//           fullName: 'James Wilson',
//           email: 'james.w@company.com',
//           designationId: '6',
//           designationName: 'Director of Product',
//           designationRank: 4,
//           departmentId: '2',
//           departmentName: 'Product',
//           jobTitleId: '11',
//           jobTitleName: 'Director of Product',
//           supervisorId: '2',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-04-15').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-chart-bar',
//         leaf: false,
//         selectable: true
//       },
//       {
//         key: '7',
//         label: 'Lisa Park',
//         data: {
//           id: '7',
//           publicId: 'EMP-1007',
//           userId: 'user-7',
//           firstName: 'Lisa',
//           lastName: 'Park',
//           fullName: 'Lisa Park',
//           email: 'lisa.p@company.com',
//           designationId: '7',
//           designationName: 'Director of QA',
//           designationRank: 4,
//           departmentId: '3',
//           departmentName: 'Quality Assurance',
//           jobTitleId: '12',
//           jobTitleName: 'Director of QA',
//           supervisorId: '2',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-05-01').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-check-circle',
//         leaf: false,
//         selectable: true
//       }
//     ];
//   }

//   private generateCFODirectReports(): EmployeeOrgNode[] {
//     return [
//       {
//         key: '8',
//         label: 'Robert Martinez',
//         data: {
//           id: '8',
//           publicId: 'EMP-1008',
//           userId: 'user-8',
//           firstName: 'Robert',
//           lastName: 'Martinez',
//           fullName: 'Robert Martinez',
//           email: 'robert.m@company.com',
//           designationId: '8',
//           designationName: 'Director of Finance',
//           designationRank: 4,
//           departmentId: '4',
//           departmentName: 'Finance',
//           jobTitleId: '13',
//           jobTitleName: 'Director of Finance',
//           supervisorId: '3',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-04-20').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-dollar',
//         leaf: false,
//         selectable: true
//       },
//       {
//         key: '9',
//         label: 'Patricia Moore',
//         data: {
//           id: '9',
//           publicId: 'EMP-1009',
//           userId: 'user-9',
//           firstName: 'Patricia',
//           lastName: 'Moore',
//           fullName: 'Patricia Moore',
//           email: 'patricia.m@company.com',
//           designationId: '9',
//           designationName: 'Director of Accounting',
//           designationRank: 4,
//           departmentId: '4',
//           departmentName: 'Finance',
//           jobTitleId: '14',
//           jobTitleName: 'Director of Accounting',
//           supervisorId: '3',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-05-05').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-calculator',
//         leaf: false,
//         selectable: true
//       }
//     ];
//   }

//   private generateCOODirectReports(): EmployeeOrgNode[] {
//     return [
//       {
//         key: '10',
//         label: 'Thomas Anderson',
//         data: {
//           id: '10',
//           publicId: 'EMP-1010',
//           userId: 'user-10',
//           firstName: 'Thomas',
//           lastName: 'Anderson',
//           fullName: 'Thomas Anderson',
//           email: 'thomas.a@company.com',
//           designationId: '10',
//           designationName: 'Director of Operations',
//           designationRank: 4,
//           departmentId: '5',
//           departmentName: 'Operations',
//           jobTitleId: '15',
//           jobTitleName: 'Director of Operations',
//           supervisorId: '4',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-04-25').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-truck',
//         leaf: false,
//         selectable: true
//       },
//       {
//         key: '11',
//         label: 'Maria Garcia',
//         data: {
//           id: '11',
//           publicId: 'EMP-1011',
//           userId: 'user-11',
//           firstName: 'Maria',
//           lastName: 'Garcia',
//           fullName: 'Maria Garcia',
//           email: 'maria.g@company.com',
//           designationId: '11',
//           designationName: 'Director of HR',
//           designationRank: 4,
//           departmentId: '6',
//           departmentName: 'Human Resources',
//           jobTitleId: '16',
//           jobTitleName: 'Director of HR',
//           supervisorId: '4',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-05-10').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-users',
//         leaf: false,
//         selectable: true
//       }
//     ];
//   }

//   private generateEngineeringDirectReports(): EmployeeOrgNode[] {
//     return [
//       {
//         key: '12',
//         label: 'Kevin Zhang',
//         data: {
//           id: '12',
//           publicId: 'EMP-1012',
//           userId: 'user-12',
//           firstName: 'Kevin',
//           lastName: 'Zhang',
//           fullName: 'Kevin Zhang',
//           email: 'kevin.z@company.com',
//           designationId: '12',
//           designationName: 'Engineering Manager',
//           designationRank: 6,
//           departmentId: '1',
//           departmentName: 'Engineering',
//           jobTitleId: '17',
//           jobTitleName: 'Engineering Manager',
//           supervisorId: '5',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-06-01').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-code',
//         leaf: false,
//         selectable: true
//       },
//       {
//         key: '13',
//         label: 'Rachel Green',
//         data: {
//           id: '13',
//           publicId: 'EMP-1013',
//           userId: 'user-13',
//           firstName: 'Rachel',
//           lastName: 'Green',
//           fullName: 'Rachel Green',
//           email: 'rachel.g@company.com',
//           designationId: '13',
//           designationName: 'Engineering Manager',
//           designationRank: 6,
//           departmentId: '1',
//           departmentName: 'Engineering',
//           jobTitleId: '17',
//           jobTitleName: 'Engineering Manager',
//           supervisorId: '5',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-06-10').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-code',
//         leaf: false,
//         selectable: true
//       }
//     ];
//   }

//   private generateProductDirectReports(): EmployeeOrgNode[] {
//     return [
//       {
//         key: '14',
//         label: 'Monica Geller',
//         data: {
//           id: '14',
//           publicId: 'EMP-1014',
//           userId: 'user-14',
//           firstName: 'Monica',
//           lastName: 'Geller',
//           fullName: 'Monica Geller',
//           email: 'monica.g@company.com',
//           designationId: '14',
//           designationName: 'Product Manager',
//           designationRank: 6,
//           departmentId: '2',
//           departmentName: 'Product',
//           jobTitleId: '18',
//           jobTitleName: 'Product Manager',
//           supervisorId: '6',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: true,
//           createdOn: new Date('2023-06-15').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-chart-bar',
//         leaf: false,
//         selectable: true
//       }
//     ];
//   }

//   private generateEMDirectReports(): EmployeeOrgNode[] {
//     return [
//       {
//         key: '15',
//         label: 'Ross Geller',
//         data: {
//           id: '15',
//           publicId: 'EMP-1015',
//           userId: 'user-15',
//           firstName: 'Ross',
//           lastName: 'Geller',
//           fullName: 'Ross Geller',
//           email: 'ross.g@company.com',
//           designationId: '15',
//           designationName: 'Senior Software Engineer',
//           designationRank: 8,
//           departmentId: '1',
//           departmentName: 'Engineering',
//           jobTitleId: '19',
//           jobTitleName: 'Senior Software Engineer',
//           supervisorId: '12',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: false,
//           createdOn: new Date('2023-07-01').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-user',
//         leaf: true,
//         selectable: true
//       },
//       {
//         key: '16',
//         label: 'Chandler Bing',
//         data: {
//           id: '16',
//           publicId: 'EMP-1016',
//           userId: 'user-16',
//           firstName: 'Chandler',
//           lastName: 'Bing',
//           fullName: 'Chandler Bing',
//           email: 'chandler.b@company.com',
//           designationId: '16',
//           designationName: 'Software Engineer',
//           designationRank: 9,
//           departmentId: '1',
//           departmentName: 'Engineering',
//           jobTitleId: '20',
//           jobTitleName: 'Software Engineer',
//           supervisorId: '12',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: false,
//           createdOn: new Date('2023-07-15').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-user',
//         leaf: true,
//         selectable: true
//       },
//       {
//         key: '17',
//         label: 'Phoebe Buffay',
//         data: {
//           id: '17',
//           publicId: 'EMP-1017',
//           userId: 'user-17',
//           firstName: 'Phoebe',
//           lastName: 'Buffay',
//           fullName: 'Phoebe Buffay',
//           email: 'phoebe.b@company.com',
//           designationId: '17',
//           designationName: 'Junior Developer',
//           designationRank: 10,
//           departmentId: '1',
//           departmentName: 'Engineering',
//           jobTitleId: '21',
//           jobTitleName: 'Junior Developer',
//           supervisorId: '12',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: false,
//           createdOn: new Date('2023-08-01').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-user',
//         leaf: true,
//         selectable: true
//       }
//     ];
//   }

//   private generatePMDirectReports(): EmployeeOrgNode[] {
//     return [
//       {
//         key: '18',
//         label: 'Joey Tribbiani',
//         data: {
//           id: '18',
//           publicId: 'EMP-1018',
//           userId: 'user-18',
//           firstName: 'Joey',
//           lastName: 'Tribbiani',
//           fullName: 'Joey Tribbiani',
//           email: 'joey.t@company.com',
//           designationId: '18',
//           designationName: 'Product Analyst',
//           designationRank: 9,
//           departmentId: '2',
//           departmentName: 'Product',
//           jobTitleId: '22',
//           jobTitleName: 'Product Analyst',
//           supervisorId: '14',
//           isOrphen: false,
//           isActive: true,
//           hasDirectReports: false,
//           createdOn: new Date('2023-07-20').toString(),
//           lastModifiedOn: new Date().toString()
//         },
//         icon: 'pi pi-user',
//         leaf: true,
//         selectable: true
//       }
//     ];
//   }
// }