import { CommonJobTitleDesignationResponse } from "./common-job-title-designation-response.model";
import { JobTitleResponseModel } from "./job-title-response.model";


export interface JobTitleWithEmployeeCountResponseModel extends JobTitleResponseModel {
  employeeCount: number;
  commonDesignations: CommonJobTitleDesignationResponse[];
}


