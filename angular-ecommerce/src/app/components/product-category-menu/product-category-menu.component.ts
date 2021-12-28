import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit, OnDestroy {
  productCategories!: ProductCategory[];
  productSubscription!: Subscription;

  constructor(private productService: ProductService) {

  }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productSubscription = this.productService.fetchProductCategories().subscribe(
      responseData => {
        console.log(JSON.stringify(responseData));
        this.productCategories = responseData
      }
    );
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
