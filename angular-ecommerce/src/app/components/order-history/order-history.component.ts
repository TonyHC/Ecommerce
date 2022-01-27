import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  orderHistorySubscription!: Subscription;

  constructor(private orderHistory: OrderHistoryService) {

  }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    // Parse and retireve the user's email address from browser session storage
    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);

    // Retrieve orderHistory array data from order history service
    this.orderHistorySubscription = this.orderHistory.fetchOrderHistory(userEmail)!.subscribe(
      response => this.orderHistoryList = response
    );
  }

  ngOnDestroy(): void {
    this.orderHistorySubscription.unsubscribe();
  }
}
