import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../models/order-history';

export interface orderHistoryResponse {
  _embedded: {
    orders: OrderHistory[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private ordersUrl = environment.ecommerceApiUrl + '/orders';

  constructor(private http: HttpClient) {

  }

  fetchOrderHistory(userEmail: string): Observable < OrderHistory[] > {
    return this.http.get<orderHistoryResponse>(`${this.ordersUrl}/search/findByCustomerEmailOrderByDateCreatedDesc`, {
        params: new HttpParams().set('email', userEmail)
      })
      .pipe(
        map(responseData => responseData._embedded.orders)
      );
  }
}
