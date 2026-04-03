import { AuditableBaseModel } from "../_base/base.model";

export interface DepartmentResponseModel extends AuditableBaseModel {
  publicId: string;  // e.g., DEP-1001
  tenantId: string;  // Guid of the tenant
  name: string;
  description: string;
  isActive: boolean;
}
