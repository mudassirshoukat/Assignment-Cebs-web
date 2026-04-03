import { InvitationResponse as InvitationResponseModel } from "./invitation-response.model";


export interface InvitationWithTitlesResponseModel extends InvitationResponseModel {
  designationId: string; //Guid ->string
  designationName: string;
  departmentId?: string; //Guid ->string
  departmentName?: string;
  jobTitleId?: string; //Guid ->string
  jobTitleName?: string;
}
