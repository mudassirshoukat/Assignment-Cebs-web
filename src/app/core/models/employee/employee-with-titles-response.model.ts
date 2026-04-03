import { EmployeeResponseModel } from "./employee-response.model";


export interface EmployeeWithTitlesResponseModel extends EmployeeResponseModel {
  designationName: string;
  designationRank: number;
  departmentId?: string; //Guid ->string
  departmentName?: string;
  jobTitleName?: string;
}

import { TreeNode } from 'primeng/api';

// This is your data model
export interface EmployeeNodeModel extends EmployeeWithTitlesResponseModel {
  hasDirectReports: boolean;
}

// This is what the Component actually consumes
// We use the 'data' property of TreeNode to store your Employee object
export type EmployeeOrgNode = TreeNode<EmployeeNodeModel>;
