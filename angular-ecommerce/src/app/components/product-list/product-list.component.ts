import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products!: Product[];
  currentCategoryId!: number;
  currentCategoryName!: string;
  searchMode!: boolean;
  currentKeyword!: string;

  productSubscription!: Subscription;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    // Check if "id" parameter exists
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // Get the "id" parameter string and convert string to a number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // The "id" parameter does not exist, default to category id: 1
      this.currentCategoryId = 1;
    }

    this.productService.fetchProductCategoryByCategoryId(this.currentCategoryId).subscribe((responseData) => {
      responseData ? this.currentCategoryName = responseData.categoryName : this.currentCategoryName = 'Books';
    });

    // Now we get the list of products based on the category id
    this.productService.fetchProductsByCategoryId(this.currentCategoryId).subscribe((responseData) => {
      console.log(JSON.stringify(responseData));
      this.products = responseData;
    });
  }

  handleSearchProducts() {
    this.currentKeyword = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProductsByKeyword(this.currentKeyword).subscribe((responseData) => {
      console.log(JSON.stringify(responseData));
      this.products = responseData;
    });
  }
}
