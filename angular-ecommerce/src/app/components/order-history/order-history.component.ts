import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { OrderHistory } from 'src/app/models/order-history';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  show: boolean = false;
  orderTrackingNumber: string = '';

  orderHistorySubscription!: Subscription;
  productSubscription!: Subscription;

  constructor(private orderHistory: OrderHistoryService,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private checkoutService: CheckoutService) {

  }

  ngOnInit(): void {
    this.handleOrderHistory();
    this.populateOrderTrackingNumber();
  }

  populateOrderTrackingNumber() {
    this.checkoutService.orderTrackingNumberNotification.subscribe(
      responseData => {
        this.show = responseData !== '';
        this.orderTrackingNumber = responseData;
      }
    );

    if (this.show) {
     setTimeout(() => {
        this.checkoutService.orderTrackingNumberNotification.next('');
      }, 5000);
    }
  }

  handleOrderHistory() {
    // Parse and retireve the user's email address from browser session storage
    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);

    // Retrieve orderHistory array data from order history service
    this.orderHistorySubscription = this.orderHistory.fetchOrderHistory(userEmail)!.subscribe(
      response => this.orderHistoryList = response
    );
  }

  onAddProductToShoppingCart(productId: string) {
    this.productSubscription = this.productService.fetchProductByProductId(+productId).subscribe(
      response => {
        const shoppingCartItem = new ShoppingCartItem(response);
        this.shoppingCartService.addItemToShoppingCart(shoppingCartItem);
      }
    );
  }

  copyContent() {
    const orderTrackingNumberContent = document.querySelector('div.position-fixed ngb-toast div#trackingNum')!;
    const trackingNumber = orderTrackingNumberContent.textContent!.replace(/['"]+/g, '').trim().split(":");

    navigator.clipboard.writeText(trackingNumber[1]);
  }

  ngOnDestroy(): void {
    this.orderHistorySubscription.unsubscribe();

    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
