import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistory: OrderHistoryService) {

  }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    // Parse and retireve the user's email address from browser session storage
    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);

    // Retrieve orderHistory array data from order history service
    this.orderHistory.fetchOrderHistory(userEmail)!.subscribe(
      response => this.orderHistoryList = response
    );
  }
}
