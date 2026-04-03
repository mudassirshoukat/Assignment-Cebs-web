import { RoleEnum } from "../../enums/role.enum";


export interface RegisterUserRequestModel {
  Email: string;
  FirstName: string;
  LastName: string;
  roleEnum: RoleEnum;
  Password: string;
}
