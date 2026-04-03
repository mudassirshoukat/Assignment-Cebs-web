import { AuditableBaseModel } from "../_base/base.model";

export interface JobTitleResponseModel extends AuditableBaseModel {
  publicId: string;
  departmentId: string;
  name: string;   // Software Engineer, QA Engineer
  description: string;   
  isActive: boolean;
}


