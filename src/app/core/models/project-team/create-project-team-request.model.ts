
export interface CreateProjectTeamRequestModel {
  projectId: string;   // Guid → string
  teamId: string;      // Guid → string
  responsibleFor: string | null;
}
