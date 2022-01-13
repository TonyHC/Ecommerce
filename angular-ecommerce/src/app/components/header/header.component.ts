import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  totalQuantity: number = 0;

  productNames: string[] = [];

  userName: string = '';
  isAuthenticated: boolean = false;

  constructor(private router: Router,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService,
    public authStateService: OktaAuthStateService,
    private oktaAuth: OktaAuth) {

  }

  ngOnInit() {
    this.updateShoppingCartStatus();
    this.initSearchBarTypehead();

    this.getUserDetails();
  }

  getUserDetails() {
    this.authStateService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      if (this.isAuthenticated) {
        this.oktaAuth.getUser().then(
          (response) => this.userName = response.name as string
        )
      }
    });
  }

  onSearchProducts(keyword: string) {
    this.router.navigateByUrl(`search/${keyword}`);
  }

  updateShoppingCartStatus() {
    this.shoppingCartService.totalQuantity.subscribe(
      responseData => this.totalQuantity = responseData
    );
  }

  initSearchBarTypehead() {
    this.productService.fetchProducts().subscribe(
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

  logout() {
    // Termintaes the session with okta and removes current tokens
    this.oktaAuth.signOut();
  }
}
