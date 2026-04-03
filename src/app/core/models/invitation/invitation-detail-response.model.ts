import { InvitationSourceEnum } from "../../enums/invitation/invitation-source.enum";
import { InvitationStatusEnum } from "../../enums/invitation/invitation-status.enum";
import { RoleEnum } from "../../enums/role.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { UserResponseModel } from "../user/user-response.model";


export interface InvitationDetailResponse extends AuditableBaseModel {
    userId: string | null;
    tenantId: string;
    email: string;
    token: string;
    source: InvitationSourceEnum;
    role: RoleEnum;
    status: InvitationStatusEnum;
    lastInviteSentAt: string;
    sendCount: number;
    user: UserResponseModel;
}