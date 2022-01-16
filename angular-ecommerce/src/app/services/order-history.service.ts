import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderHistory } from '../common/order-history';

export interface orderHistoryResponse {
  _embedded: {
    orders: OrderHistory[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private ordersUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {

  }

  fetchOrderHistory(userEmail: string): Observable<OrderHistory[]> {
    const orderHistoryUr = this.ordersUrl + `/search/findByCustomerEmailOrderByDateCreatedDesc?email=${userEmail}`;

    return this.http.get<orderHistoryResponse>(orderHistoryUr).pipe(
      map(responseData => responseData._embedded.orders)
    );
  }
}
