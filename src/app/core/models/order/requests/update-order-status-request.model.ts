import { OrderStatusEnum } from "../../../enums/orders/order-status.enum";

export interface UpdateOrderStatusRequestModel {
  id: string;
  status: OrderStatusEnum;
}
