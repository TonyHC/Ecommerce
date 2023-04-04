import { Component, OnDestroy, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { Subscription } from 'rxjs';
import { ProductCategory } from 'src/app/models/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  productCategories: ProductCategory[] = [];
  currentYear: number = new Date().getFullYear();
  isAuthenticated: boolean = false;
  storage: Storage = sessionStorage;

  productSubscription!: Subscription;
  oktaAuthStateSubscription!: Subscription;

  constructor(private productService: ProductService,
    private authStateService: OktaAuthStateService) {

  }

  ngOnInit(): void {
    this.listProductCategories();
    this.getUserAuthenticationState();
  }

  listProductCategories() {
    this.productSubscription = this.productService.fetchProductCategories().subscribe(
      responseData => {
        this.productCategories = responseData;
      }
    );
  }

  getUserAuthenticationState() {
    this.oktaAuthStateSubscription = this.authStateService.authState$.subscribe(
      result => this.isAuthenticated = result.isAuthenticated!
    );
  }

  ngOnDestroy(): void {
    this.oktaAuthStateSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
  }
}
