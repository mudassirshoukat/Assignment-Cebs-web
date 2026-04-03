import { DesignationResponseModel } from "./designation-response.model";

export interface DesignationWithCountResponseModel extends DesignationResponseModel {
  employeeCount: number; // Number of employees with this designation
}
