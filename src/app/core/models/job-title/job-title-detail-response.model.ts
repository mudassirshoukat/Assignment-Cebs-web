import { DepartmentResponseModel } from "../department/department-response.model";
import { CommonJobTitleDesignationResponseModel } from "../job-title-designation/common-job-title-designation-response.model";
import { JobTitleResponseModel } from "./job-title-response.model";


export interface JobTitleDetailResponseModel extends JobTitleResponseModel {
  employeeCount: number;
  department: DepartmentResponseModel;
  commonDesignations: CommonJobTitleDesignationResponseModel[];
}
