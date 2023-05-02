import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Purchase } from '../models/purchase';
import { PaymentInfo } from '../models/payment-info.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = environment.ecommerceApiUrl + '/checkout/purchase';
  private paymentIntentUrl = environment.ecommerceApiUrl + '/checkout/payment-intent';

  orderTrackingNumberNotification: Subject<string> = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.http.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.http.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
