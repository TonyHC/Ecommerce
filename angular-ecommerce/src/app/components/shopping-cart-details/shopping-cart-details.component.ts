import { Component, OnInit } from '@angular/core';
import { ShoppingCartItem } from 'src/app/common/shopping-cart-item';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-details',
  templateUrl: './shopping-cart-details.component.html',
  styleUrls: ['./shopping-cart-details.component.css'],
})
export class ShoppingCartDetailsComponent implements OnInit {
  shoppingCartItems: ShoppingCartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.listShoppingCartDetails();
  }

  listShoppingCartDetails() {
    this.shoppingCartItems = this.shoppingCartService.shoppingCartItems;

    this.shoppingCartService.totalPrice.subscribe(
      (responseData) => (this.totalPrice = responseData)
    );

    this.shoppingCartService.totalQuantity.subscribe(
      (responseData) => (this.totalQuantity = responseData)
    );

    this.shoppingCartService.computeShoppingCartTotals();
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
}
