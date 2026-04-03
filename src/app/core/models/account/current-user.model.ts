import { RoleNameEnum } from "../../enums/role.enum";

export interface CurrentUserModel {
    userId: string;
    email: string;
    role: RoleNameEnum;
}
