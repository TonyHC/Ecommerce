import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingCartItem } from 'src/app/common/shopping-cart-item';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-details',
  templateUrl: './shopping-cart-details.component.html',
  styleUrls: ['./shopping-cart-details.component.css'],
})
export class ShoppingCartDetailsComponent implements OnInit, OnDestroy {
  shoppingCartItems: ShoppingCartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  totalPriceSubscription!: Subscription;
  totalQuantitySubscription!: Subscription;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.listShoppingCartDetails();
  }

  listShoppingCartDetails() {
    this.shoppingCartItems = this.shoppingCartService.shoppingCartItems;

    this.totalPriceSubscription = this.shoppingCartService.totalPrice.subscribe(
      (responseData) => (this.totalPrice = responseData)
    );

    this.totalQuantitySubscription = this.shoppingCartService.totalQuantity.subscribe(
      (responseData) => (this.totalQuantity = responseData)
    );
  }

  onIncrementItemQuantity(shoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.addItemToShoppingCart(shoppingCartItem);
  }

  onDecrementItemQuantity(shoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.decrementShoppingCartItemQuantity(shoppingCartItem);
  }

  removeItemFromShoppingCart(shoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.removeItemFromShoppingCart(shoppingCartItem);
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription.unsubscribe();
    this.totalQuantitySubscription.unsubscribe();
  }
}
