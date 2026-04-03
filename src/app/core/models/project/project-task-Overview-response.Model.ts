export interface TaskStatusOverviewByProjectResponseModel {
    projectId: string; // Guid
    total: number;
    todo: number;
    inProgress: number;
    inReview: number;
    completed: number;
    progressPercentage: number;//0-100% by project
}
