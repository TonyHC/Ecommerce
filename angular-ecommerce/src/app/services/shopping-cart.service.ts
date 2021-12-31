import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ShoppingCartItem } from '../common/shopping-cart-item';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  shoppingCartItems: ShoppingCartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  addItemToShoppingCart(shoppingCartItem: ShoppingCartItem) {
    // Check if we already have the item in the shopping cart
    let itemExistsInCart: boolean = false;
    let existingShoppingCartItem: ShoppingCartItem | undefined = undefined;

    if (this.shoppingCartItems.length > 0) {
      // Return the first element that passes the condition, otherwise returns undefined
      existingShoppingCartItem = this.shoppingCartItems.find(currentShoppingCartItem =>
        currentShoppingCartItem.id == shoppingCartItem.id
      );

      // Check if we found the item
      itemExistsInCart = existingShoppingCartItem != null;
    }

    if (itemExistsInCart) {
      // Increment the quantity of the item by one
      existingShoppingCartItem!.quantity++;
    } else {
      // Otherwise just add the new item to the shopping cart
      this.shoppingCartItems.push(shoppingCartItem);
    }

    // Compute shopping cart total price and total quantity
    this.computeShoppingCartTotals();
  }

  private computeShoppingCartTotals() {
    let totalItemPrices: number = 0;
    let totalItemQuantity: number = 0;

    for (let currentShoppingCartItem of this.shoppingCartItems) {
      totalItemPrices +=
        currentShoppingCartItem.quantity * currentShoppingCartItem.unitPrice;
      totalItemQuantity += currentShoppingCartItem.quantity;
    }

    // Publish totalPrice and totalQuantity events, so all subscribers who subscribe will receive the new data
    this.totalPrice.next(totalItemPrices);
    this.totalQuantity.next(totalItemQuantity);
  }
}
