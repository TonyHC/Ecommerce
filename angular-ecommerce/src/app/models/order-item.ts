import { ShoppingCartItem } from "./shopping-cart-item";

export class OrderItem {
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  productId: string;

  constructor(shoppingCartItem: ShoppingCartItem) {
    this.name = shoppingCartItem.name;
    this.imageUrl = shoppingCartItem.imageUrl;
    this.unitPrice = shoppingCartItem.unitPrice;
    this.quantity = shoppingCartItem.quantity;
    this.productId = shoppingCartItem.id;
  }
}
