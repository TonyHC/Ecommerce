import { Address } from "./address";
import { Customer } from "./customer";
import { OrderItem } from "./order-item";

export class OrderHistory {
  id!: number;
  orderTrackingNumber!: string;
  totalPrice!: number;
  totalQuantity!: number;
  dateCreated!: Date;
  customer!: Customer;
  shippingAddress!: Address;
  orderItems!: OrderItem[];
}
