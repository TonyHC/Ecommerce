import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add access token for secured endpoints
    const secureEndpoints = [environment.ecommerceApiUrl + '/orders',  environment.ecommerceApiUrl + '/checkout'];

    if (secureEndpoints.some(url => req.urlWithParams.includes(url))) {
      // Get access token
      const accessToken = this.oktaAuth.getAccessToken();

      // Clone the request and add header with access token
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    return next.handle(req);
  }
}
