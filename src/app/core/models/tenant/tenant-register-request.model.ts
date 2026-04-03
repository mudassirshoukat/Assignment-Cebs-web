import { AdminRequestModel } from "../admin/admin-request.model";

export interface CreateTenantRequestModel {
  specialtyAreaId: string;
  name: string;
  slug: string;
  physicalAddress: string;
  city: string;
  state: string;
  country: string;
  admin: AdminRequestModel;
}

