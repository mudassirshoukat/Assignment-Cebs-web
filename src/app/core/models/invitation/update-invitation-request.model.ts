import { RoleEnum } from "../../enums/role.enum";

export interface UpdateInvitationRequestModel {
    id: string;
    role: RoleEnum;
}