export interface UpdateJobTitleRequestModel {
  id: string;                     // Guid of the job title
  name: string;
  description: string;
  commonDesignationIds?: string[]; // optional list of Designation IDs
}
