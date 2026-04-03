export interface CreateJobTitleRequestModel {
  name: string;                   // Software Engineer, QA Engineer
  description: string;
  departmentId: string;           // Guid of the department
  commonDesignationIds?: string[]; // optional list of Designation IDs
}
