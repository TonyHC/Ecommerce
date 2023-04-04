import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  totalQuantity: number = 0;

  productNames: string[] = [];

  userName!: string;
  isAuthenticated: boolean = false;
  storage: Storage = sessionStorage;

  shoppingCartSubscription!: Subscription;
  productSubscription!: Subscription;
  oktaAuthStateSubscription!: Subscription;

  constructor(private router: Router,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService,
    private authStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

  }

  ngOnInit() {
    this.updateShoppingCartStatus();
    this.initSearchBarTypehead();
    this.getUserDetails();
  }

  getUserDetails() {
    this.oktaAuthStateSubscription = this.authStateService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;

      // Fetch the logged in user details (user's claims)
      if (this.isAuthenticated) {
        this.oktaAuth.getUser().then((response) => {
          // Retrieve and store the user's full name
          const fullName = response.name;
          this.userName = fullName!;

          // Retrieve the user's email from authentication response
          const email = response.email;

          // Store the user's full name in browser session storage
          this.storage.setItem('userName', JSON.stringify(fullName));

          // Store the email in browser session storage
          this.storage.setItem('userEmail', JSON.stringify(email));
        });
      }
    });
  }

  onSearchProducts(keyword: string) {
    this.router.navigateByUrl(`search/${keyword}`);
  }

  updateShoppingCartStatus() {
    this.shoppingCartSubscription = this.shoppingCartService.totalQuantity.subscribe(
      responseData => this.totalQuantity = responseData
    );
  }

  initSearchBarTypehead() {
    this.productSubscription = this.productService.fetchProductsPaginate().subscribe(
      responseData => responseData.forEach(product => this.productNames.push(product.name))
    );
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.productNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  async logout() {
    // Termintaes the session with okta and removes current tokens
    await this.oktaAuth.signOut();
  }

  ngOnDestroy(): void {
    this.oktaAuthStateSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
    this.shoppingCartSubscription.unsubscribe();
  }
}
