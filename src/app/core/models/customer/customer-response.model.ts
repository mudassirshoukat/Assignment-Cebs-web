import { AuditableBaseModel } from "../_base/base.model";

export interface CustomerResponseModel extends AuditableBaseModel {
  userId: string;       // Guid → string
  publicId: string;     // e.g., CU-1001
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;     // computed on backend: `${firstName} ${lastName}`.trim()
}