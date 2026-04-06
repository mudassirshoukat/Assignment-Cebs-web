import { OrderStatusEnum } from "../../enums/orders/order-status.enum";
import { ProjectPriorityEnum } from "../../enums/project/project-priority.enum";
import { ProjectStatusEnum } from "../../enums/project/project-status.enum";
import { AuditableBaseModel } from "../_base/base.model";
import { CustomerResponseModel } from "../customer/customer-response.model";
import { EmployeeResponseModel } from "../employee/employee-response.model";

export interface OrderResponseModel extends AuditableBaseModel {
publicId: string;              // e.g., Or-1001
  customerId: string;
  amount: number;
  status: OrderStatusEnum;
  customer: CustomerResponseModel; 
}


