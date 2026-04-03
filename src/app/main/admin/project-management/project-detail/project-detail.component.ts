import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { TeamService } from '../../../../core/services/domain/team.service';
import { ProjectService } from '../../../../core/services/domain/project.service';
import { ProjectTeamService } from '../../../../core/services/domain/project-team.service';
import { TeamMemberService } from '../../../../core/services/domain/team-member.service';
import { ProjectTaskService } from '../../../../core/services/domain/project-task.service';
import { ProjectDetailResponseModel } from '../../../../core/models/project/project-detail-response.model';
import { MessageService } from 'primeng/api';
import { ProjectStatusEnum } from '../../../../core/enums/project/project-status.enum';
import { ProjectTaskResponseModel } from '../../../../core/models/project-task/project-task-response.model';
import { TaskStatusEnum } from '../../../../core/enums/project-task/project-task-status.enum';
import { GetProjectTaskListQuery } from '../../../../core/models/project-task/project-task-list-query.model';
import { finalize } from 'rxjs';
import { PagedResult } from '../../../../core/models/_pagination/paged-result-response.model';
import { ProjectTaskWithAssigneeResponseModel } from '../../../../core/models/project-task/project-task-with-assignee-response.model';
import { InitialsPipe } from "../../../../shared/pipes/initials.pipe";
import { TaskPriorityEnum } from '../../../../core/enums/project-task/project-task-priority-status.enum';
import { ProjectTeamStatsResponseModel } from '../../../../core/models/project-team/project-team-stats-response.model';
import { GetProjectTeamListRequestModel } from '../../../../core/models/project-team/project-team-list-query.model';
import { TeamMemberResponseModel } from '../../../../core/models/team-member/team-member-response.model';
import { TeamMemberWithTaskCountResponseModel } from '../../../../core/models/team-member/team-member--task-count-response.model';
import { TeamResponseModel } from '../../../../core/models/team/team-response.model';
import { GetTeamMemberListByProjectRequestModel } from '../../../../core/models/team-member/team-member-by-project-list-query.model';
import { ProjectTeamResponseModel } from '../../../../core/models/project-team/project-team-response.model';
import { ProjectTeamLookupResponseModel } from '../../../../core/models/project-team/project-team-lookup-response.model';
import { GetProjectTeamListlookupRequestModel } from '../../../../core/models/project-team/project-team-list-lookup-query.model';
import { TeamMemberRoleEnum } from '../../../../core/enums/team-member/team-member-role.enum';
import { PaginatorModule } from "primeng/paginator";
import { ProjectDashboardAdminResponseModel } from '../../../../core/models/project/project-dashboard-admin-response.model';
import { ProjectResponseModel } from '../../../../core/models/project/project-response.model';
import { ProjectStatsModel } from '../../../../core/models/project/project-stats-response.Model';
import { TaskStatusOverviewByProjectResponseModel } from '../../../../core/models/project/project-task-Overview-response.Model';
import { ProjectPriorityEnum } from '../../../../core/enums/project/project-priority.enum';
import { AppDateTimePipe } from "../../../../shared/pipes/app-datetime.pipe";
import { AppDatePipe } from "../../../../shared/pipes/app-date.pipe";
import { AppDaysRemainingPipe } from "../../../../shared/pipes/app-days-remaining.pipe";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DropdownModule,
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
    ProgressSpinnerModule,
    KnobModule,
    MenuModule,
    TooltipModule,
    InitialsPipe,
    PaginatorModule,
    AppDateTimePipe,
    AppDatePipe,
    AppDaysRemainingPipe
  ]
})
export class ProjectDetailComponent implements OnInit {

  projectId!: string;
  project!: ProjectResponseModel;
  projectStats!: ProjectStatsModel;
  mainTeam!: ProjectTeamStatsResponseModel;
  taskStatusOverview!: TaskStatusOverviewByProjectResponseModel;
  projectDummy: any;
  isLoading = signal(false);

  activeTabIndex = 0;
  // Tab loading states
  tasksTabLoaded = signal(false);
  teamsTabLoaded = signal(false);
  collaboratorsTabLoaded = signal(false);

  // Tab loading states
  isTasksLoading = signal(false);
  isTeamsLoading = signal(false);
  isCollaboratorsLoading = signal(false);
  // Tab data


  // Tasks tab
  tasks: ProjectTaskWithAssigneeResponseModel[] = [];
  taskSearch = '';
  selectedTaskStatus: TaskStatusEnum | null = null;

  taskStatusOptions = [
    { label: 'All', value: null },
    { label: 'To Do', value: TaskStatusEnum.Todo },
    { label: 'In Progress', value: TaskStatusEnum.InProgress },
    { label: 'In Review', value: TaskStatusEnum.Review },
    { label: 'Done', value: TaskStatusEnum.Done },
    { label: 'Cancelled', value: TaskStatusEnum.Cancelled },
    { label: 'Blocked', value: TaskStatusEnum.Blocked }
  ];

  // Teams tab
  projectTeams: ProjectTeamStatsResponseModel[] = [];

  // Collaborators tab
  collaborators: TeamMemberWithTaskCountResponseModel[] = [];
  selectedTeamIdFilter: string | null = null;//teamId
  teamFilterOptions: { label: string; value: string | null }[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    public projectTaskService: ProjectTaskService,
    public projectTeamService: ProjectTeamService,
    public teamMemberService: TeamMemberService,
    private messageService: MessageService,
    private router: Router
  ) {

  }

  ngOnInit() {


    this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.loadProjectData(this.projectId);
    this.loadTeamsForFilters();

    // Load overview tab data immediately
    this.tasksTabLoaded.set(false);
    this.teamsTabLoaded.set(false);
    this.collaboratorsTabLoaded.set(false);
  }
  loadProjectData(projectId: string) {
    // Simulate loading
    this.isLoading.set(true);
    this.projectService.getAdminDashboardById(projectId).subscribe({
      next: (data: ProjectDashboardAdminResponseModel) => {
        this.project = data.project;
        this.projectStats = data.stats;
        this.mainTeam = data.mainTeam;
        this.taskStatusOverview = data.taskStatusOverview;
      },
      error: (error) => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load project data.' });

      }
    });
  }


  loadTeamsForFilters() {
    const param: GetProjectTeamListlookupRequestModel = {
      projectId: this.projectId
    };

    this.projectTeamService.getProjectTeamListLookup(param).subscribe({
      next: (response: ProjectTeamLookupResponseModel[]) => {
        console.log("Team filter options response:", response);
        this.teamFilterOptions = [
          { label: 'All Teams', value: null },
          ...response
            .map(team => ({
              label: team.name,
              value: team.teamId
            }))
        ];
        console.log("Team filter options:", this.teamFilterOptions);

      },
      error: (err) => {
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }


  // Tab change handler
  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    console.log('Active Tab Index:', this.activeTabIndex);
    switch (event.index) {
      case 1: // Tasks
        if (!this.tasksTabLoaded()) {
          this.projectTaskService.pageNumber.set(1);
          this.loadTasks();
          this.tasksTabLoaded.set(true);

        }
        break;

      case 2: // Teams
        if (!this.teamsTabLoaded()) {
          this.projectTeamService.pageNumber.set(1);
          this.loadTeams();
          this.teamsTabLoaded.set(true);
        }
        break;

      case 3: // Collaborators
        if (!this.collaboratorsTabLoaded()) {
          this.teamMemberService.pageNumber.set(1);
          this.loadCollaborators();
          this.collaboratorsTabLoaded.set(true);
        }
        break;
    }
  }

  refreshTasks() {
    this.projectTaskService.pageNumber.set(1);
    this.selectedTaskStatus = null;
    this.loadTasks();
  }

  refreshTeams() {
    this.projectTeamService.pageNumber.set(1);
    this.loadTeams();
  }

  refreshCollaborators() {
    this.teamMemberService.pageNumber.set(1);
    this.selectedTeamIdFilter = null;
    this.loadCollaborators();
  }


  onTaskPageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;

    this.projectTaskService.pageNumber.set(pageNumber);
    this.projectTaskService.pageSize.set(event.rows);

    this.loadTasks();
  }


  onTaskStatusChange() {
    this.projectTaskService.pageNumber.set(1);
    this.loadTasks();
  }


  loadTasks() {
    this.isTasksLoading.set(true);
    console.log("Loading Tab Tasks---------------");

    const param: GetProjectTaskListQuery = {
      Status: this.selectedTaskStatus ?? undefined,
      projectId: this.projectId,
    };

    this.projectTaskService
      .getTaskWithAssigneeList(param)
      .pipe(finalize(() => this.isTasksLoading.set(false)))
      .subscribe({
        next: (response: PagedResult<ProjectTaskWithAssigneeResponseModel>) => {
          this.tasks = response.items;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tasks.',
            life: 3000
          });
        }
      });
  }


  onTeamPageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;

    this.projectTeamService.pageNumber.set(pageNumber);
    this.projectTeamService.pageSize.set(event.rows);
    this.loadTeams();
  }
  validTeamRowsPerPage: number[] = [2, 4, 6, 10, 20];

  updateValidRowsPerPage(totalRecords: number) {
    const defaultPageSize = this.projectTeamService.pageSize();
    this.validTeamRowsPerPage = [2, 4, 6, 10, 20].filter(x => x <= totalRecords || x === defaultPageSize);
  }

  loadTeams() {
    this.isTeamsLoading.set(true);
    console.log("Loading Tab Teams---------------");

    const param: GetProjectTeamListRequestModel = {
      projectId: this.projectId,
    };

    this.projectTeamService
      .getProjectTeamStatsList(param)
      .pipe(finalize(() => this.isTeamsLoading.set(false)))
      .subscribe({
        next: (response: PagedResult<ProjectTeamStatsResponseModel>) => {
          this.projectTeams = response.items;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load teams.',
            life: 3000
          });
        }
      });
  }


  onCollaboratorPageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;

    this.teamMemberService.pageNumber.set(pageNumber);
    this.teamMemberService.pageSize.set(event.rows);

    this.loadCollaborators();
  }


  // Handle team filter change
  onTeamFilterChange() {
    this.teamMemberService.pageNumber.set(1);
    this.loadCollaborators();
  }


  loadCollaborators() {
    console.log("Loading Tab collaborators---------------");
    this.isCollaboratorsLoading.set(true);

    const param: GetTeamMemberListByProjectRequestModel = {
      projectId: this.projectId,
      teamId: this.selectedTeamIdFilter ? this.selectedTeamIdFilter : undefined
    };

    this.teamMemberService
      .getTeamMemberWithTaskCountList(param)
      .pipe(finalize(() => this.isCollaboratorsLoading.set(false)))
      .subscribe({
        next: (response: PagedResult<TeamMemberWithTaskCountResponseModel>) => {
          this.collaborators = response.items;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load collaborators.',
            life: 3000
          });
        }
      });
  }



  // Helper methods
  getStatusSeverity(status: ProjectStatusEnum): string {
    switch (status) {
      case ProjectStatusEnum.Active: return 'success';
      case ProjectStatusEnum.Completed: return 'success';
      case ProjectStatusEnum.OnHold: return 'warning';
      case ProjectStatusEnum.Cancelled: return 'danger';
      case ProjectStatusEnum.Draft: return 'secondary';
      case ProjectStatusEnum.Archived: return 'secondary';
      default: return 'info';
    }
  }
  getStatusText(status: ProjectStatusEnum) {
    return ProjectStatusEnum[status];
  }
  getTaskPrioritySeverity(priority: TaskPriorityEnum): string {
    switch (priority) {
      case TaskPriorityEnum.Critical: return 'danger';
      case TaskPriorityEnum.High: return 'danger';
      case TaskPriorityEnum.Medium: return 'warning';
      case TaskPriorityEnum.Low: return 'info';
      default: return 'info';
    }
  }

  getTaskPriorityText(priority: TaskPriorityEnum) {
    return TaskPriorityEnum[priority];
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

  getRoleSeverity(role: TeamMemberRoleEnum): string {

    switch (role) {
      case TeamMemberRoleEnum.Member: return 'secondary';
      case TeamMemberRoleEnum.Lead: return 'info';
      default: return 'info';
    }
  }
  getRoleText(role: TeamMemberRoleEnum) {
    return TeamMemberRoleEnum[role];
  }

  getProjectPrioritySeverity(priority: ProjectPriorityEnum): string {
    switch (priority) {
      case ProjectPriorityEnum.Critical: return 'danger';
      case ProjectPriorityEnum.High: return 'danger';
      case ProjectPriorityEnum.Medium: return 'warning';
      case ProjectPriorityEnum.Low: return 'info';
      default: return 'info';
    }
  }

  getProjectPriorityText(priority: ProjectPriorityEnum) {
    return ProjectPriorityEnum[priority];
  }

  isTaskOverdue(dueDate: Date): boolean {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  }

  // Navigation methods (stubs for now)
  navigateToTeam(teamId: string) {
    console.log('Navigate to team:', teamId);
    // In real app: this.router.navigate(['/teams', teamId]);
  }

  editProject() {
    console.log('Edit project:', this.projectDummy.id);
  }

  addTask() {
    console.log('Add task to project:', this.projectDummy.id);
  }

  viewTask(taskId: number) {
    console.log('View task:', taskId);
  }

  editTask(taskId: number) {
    console.log('Edit task:', taskId);
  }

goBack() {
this.router.navigate(['/admin/projects']); // Adjust the path to your main list
}
}