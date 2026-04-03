import { DesignationResponseModel } from "../designation/designation-response.model";
import { JobTitleResponseModel } from "../job-title/job-title-response.model";
import { EmployeeResponseModel } from "./employee-response.model";

export interface EmployeeDetailResponseModel extends EmployeeResponseModel {
  designationName: string;
  designationRank: number;
  departmentId?: string; //Guid ->string
  departmentName?: string;
  jobTitleName?: string;

}
