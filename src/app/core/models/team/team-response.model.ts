import { AuditableBaseModel } from "../_base/base.model";

export interface TeamResponseModel extends AuditableBaseModel {
  name: string;
  isArchived: boolean;
}
