import { ProjectTeamStatsResponseModel } from '../project-team/project-team-stats-response.model';
import { ProjectResponseModel } from './project-response.model';
import { ProjectStatsModel } from './project-stats-response.Model';
import { TaskStatusOverviewByProjectResponseModel } from './project-task-Overview-response.Model';

export interface ProjectDashboardAdminResponseModel {
  project: ProjectResponseModel;
  stats: ProjectStatsModel;
  mainTeam: ProjectTeamStatsResponseModel;
  taskStatusOverview: TaskStatusOverviewByProjectResponseModel;
}
