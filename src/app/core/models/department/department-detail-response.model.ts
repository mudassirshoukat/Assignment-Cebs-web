import { JobTitleResponseModel } from "../job-title/job-title-response.model";
import { DepartmentResponseModel } from "./department-response.model";

export interface DepartmentDetailResponseModel extends DepartmentResponseModel {
  jobTitles: JobTitleResponseModel[]; // list of job titles in the department
}
