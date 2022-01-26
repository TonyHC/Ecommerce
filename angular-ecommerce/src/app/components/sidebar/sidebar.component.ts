import { Component, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  productCategories!: ProductCategory[];
  isAuthenticated: boolean = false;
  storage: Storage = sessionStorage;

  constructor(private productService: ProductService,
    private authStateService: OktaAuthStateService) {

  }

  ngOnInit(): void {
    this.listProductCategories();
    this.getUserAuthenticationState();
  }

  listProductCategories() {
    this.productService.fetchProductCategories().subscribe(
      responseData => {
        this.productCategories = responseData
      }
    );
  }

  getUserAuthenticationState() {
    this.authStateService.authState$.subscribe(result => this.isAuthenticated = result.isAuthenticated!);
  }
}
