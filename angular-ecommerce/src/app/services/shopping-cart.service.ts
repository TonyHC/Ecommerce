import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  shoppingCartItems: ShoppingCartItem[] = [];

  // Make use of a BehaviorSubject instead of a Subject to subscribe to get the latest published data (totalPrice, totalQuantity and shoppingCartStatus)
  // for components that haven't been loaded or created yet when subscribed to BehvaiorSubject
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  shoppingCartStatus: Subject<boolean> = new BehaviorSubject<boolean>(true);

  storage: Storage = sessionStorage;

  constructor() {
    // Read data from web browser session storage
    let cartItems = JSON.parse(this.storage.getItem('shoppingCartItems')!);

    if (cartItems != null ) {
      this.shoppingCartItems = cartItems;
    }

    // Compute shopping cart totals and status on the data that is retrieved from storage
    this.computeShoppingCartTotals();
    this.validShoppingCart();
  }

  populateProductQuantitySelectDropdown() {
    let options: any[] = [];

    for (let i = 1; i <= 10; i++) {
      options.push({value: i});
    }

    return options;
  }

  addItemToShoppingCart(shoppingCartItem: ShoppingCartItem) {
    // Check if we already have the item in the shopping cart
    let itemExistsInCart: boolean = false;
    let existingShoppingCartItem: ShoppingCartItem | undefined = undefined;

    if (this.shoppingCartItems.length > 0) {
      // Return the first element that passes the condition, otherwise returns undefined
      existingShoppingCartItem = this.shoppingCartItems.find(
        (currentShoppingCartItem) =>
          currentShoppingCartItem.id == shoppingCartItem.id
      );

      // Check if we found the item
      itemExistsInCart = existingShoppingCartItem != null;
    }

    if (itemExistsInCart) {
      // Increment the quantity of the item by corresponding added product quantity
      existingShoppingCartItem!.quantity += shoppingCartItem.quantity;
    } else {
      // Otherwise just add the new item to the shopping cart
      this.shoppingCartItems.push(shoppingCartItem);
    }

    // Compute shopping cart total price, total quantity and status
    this.computeShoppingCartTotals();
    this.validShoppingCart();
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

    // Persist shopping cart items data
    this.persistShoppingCartItems();
  }

  private persistShoppingCartItems() {
    // Store current items within shopping cart in session storage
    this.storage.setItem('shoppingCartItems', JSON.stringify(this.shoppingCartItems));
  }

  private validShoppingCart() {
    let validCart: boolean = true;
    let validShoppingCartItems: boolean[] = [];

    // Iterate through each shopping cart item to determine if valid or not and store result
    this.shoppingCartItems.forEach(shoppingCartItem => {
      shoppingCartItem.product.unitsInStock - shoppingCartItem.quantity >= 0 ?
        validShoppingCartItems.push(true) : validShoppingCartItems.push(false);
    });

    // If one shopping cart item is not valid, then the shopping cart is invalid. Otherwise, the shopping cart is valid
    validShoppingCartItems.includes(false, 0) ? validCart = false : validCart = true;

    // Publish shopping cart status
    this.shoppingCartStatus.next(validCart);
  }

  decrementShoppingCartItemQuantity(shoppingCartItem: ShoppingCartItem) {
    shoppingCartItem.quantity--;

    if (shoppingCartItem.quantity === 0) {
      // Shopping cart item quantity is zero, then remove the item from shopping cart
      this.removeItemFromShoppingCart(shoppingCartItem);
    } else {
      // Otherwise, update and publish new data to subscribers
      this.computeShoppingCartTotals();
      this.validShoppingCart();
    }
  }

  removeItemFromShoppingCart(shoppingCartItem: ShoppingCartItem) {
    // Find index of shopping cart item to be removed from shoppin cart
    const shoppingCartItemIndex = this.shoppingCartItems.findIndex(
      (itemIndex) => itemIndex.id === shoppingCartItem.id
    );

    // Remove shopping cart item
    this.shoppingCartItems.splice(shoppingCartItemIndex, 1);

    // Update and publish new data to subscribers
    this.computeShoppingCartTotals();
    this.validShoppingCart();
  }
}
