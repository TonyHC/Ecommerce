import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
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
  validShoppingCart!: boolean;

  totalPriceSubscription!: Subscription;
  totalQuantitySubscription!: Subscription;
  shoppingCartStatusSubscription!: Subscription;

  constructor(private shoppingCartService: ShoppingCartService,
    private router: Router) {}

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

    this.shoppingCartStatusSubscription = this.shoppingCartService.shoppingCartStatus.subscribe(
      response => this.validShoppingCart = response
    );
  }

  onIncrementItemQuantity(shoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.incrementShoppingCartItemQuantity(shoppingCartItem);
  }

  onDecrementItemQuantity(shoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.decrementShoppingCartItemQuantity(shoppingCartItem);
  }

  removeItemFromShoppingCart(shoppingCartItem: ShoppingCartItem) {
    this.shoppingCartService.removeItemFromShoppingCart(shoppingCartItem);
  }

  onNavigateToCheckout() {
    this.router.navigateByUrl("/checkout");
  }

  ngOnDestroy(): void {
    this.totalPriceSubscription.unsubscribe();
    this.totalQuantitySubscription.unsubscribe();
    this.shoppingCartStatusSubscription.unsubscribe();
  }
}
