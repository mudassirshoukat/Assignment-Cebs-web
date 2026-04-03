
export interface CreateTeamWithMembersRequestModel {
  name: string;   // Guid → string
  leadId: string;      // Required: The person lead the team (Employee.id) 
  memberIds: string[]; // Required: At least one member (Employee.ids)
}
