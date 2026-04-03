import { AuditableBaseModel } from "../_base/base.model";


export interface SpecialtyAreaResponseModel extends AuditableBaseModel {
  name: string;
  slug: string;
  description: string;
}
