import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName!: string;

  searchMode: boolean = false;
  currentKeyword!: string;
  previousKeyword!: string;

  currentPageNumber: number = 1;
  currentPageSize: number = 10;
  totalElements!: number;

  currentSortField: string = 'name';
  currentSortDirection: string = 'asc';

  productSubscription!: Subscription;
  productCategorySubscription!: Subscription;
  searchProductSubscription!: Subscription;

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

    // Check if we have a different category id from previous (if so, then reset page number back to first page)
    // Since Angular will reuse a component if it is current being viewed
    if (this.previousCategoryId != this.currentCategoryId) {
      this.currentPageNumber = 1;
      this.previousCategoryId = this.currentCategoryId;
    }

    // Get the category name from category for the given category id
    this.productCategorySubscription = this.productService.fetchProductCategoryById(this.currentCategoryId).subscribe((responseData) => {
      responseData ? this.currentCategoryName = responseData.categoryName : this.currentCategoryName = 'Books';
    });

    // Now we get the list of products and pagination info based on the category id, page number, and page size
    this.productSubscription = this.productService.fetchProductsByCategoryIdPaginate(
      // Angular's pagination is 1 based, while Spring Data REST is 0 based
      this.currentPageNumber - 1,
      this.currentPageSize,
      this.currentCategoryId).subscribe((responseData) => {
        this.products = responseData._embedded.products;
        this.currentPageNumber = responseData.page.number + 1;
        this.currentPageSize = responseData.page.size;
        this.totalElements = responseData.page.totalElements;
    });

    window.scrollTo(0, 0);
  }

  handleSearchProducts() {
    this.currentKeyword = this.route.snapshot.paramMap.get('keyword')!;

    // If we have a different keyword than previous, then set the page number back to 1
    if (this.previousKeyword != this.currentKeyword) {
      this.currentPageNumber = 1;
      this.previousKeyword = this.currentKeyword;
    }

    // Now we get the list of products and pagination info based on the keyword, page number, and page size
    this.searchProductSubscription = this.productService.searchProductsByKeywordPaginate(
      this.currentPageNumber - 1,
      this.currentPageSize,
      this.currentKeyword,
      this.currentSortField,
      this.currentSortDirection).subscribe((responseData) => {
        this.products = responseData._embedded.products;
        this.currentPageNumber = responseData.page.number + 1;
        this.currentPageSize = responseData.page.size;
        this.totalElements = responseData.page.totalElements;
    });

    window.scrollTo(0, 0);
  }

  updatePageSize(inputEvent: Event) {
    const newPageSize = +(inputEvent.currentTarget as HTMLInputElement).value;

    this.currentPageSize = newPageSize;
    this.currentPageNumber = 1;
    this.listProducts();
  }

  updateSortFields(inputEvent: Event) {
    const userSortChoice = (inputEvent.currentTarget as HTMLInputElement).value.split(',');

    this.currentSortField = userSortChoice[0];
    this.currentSortDirection = userSortChoice[1];
    this.currentPageNumber = 1;

    this.listProducts();
  }

  ngOnDestroy(): void {
    if (this.searchProductSubscription) {
      this.searchProductSubscription.unsubscribe;
    } else {
      this.productSubscription.unsubscribe();
      this.productCategorySubscription.unsubscribe();
    }
  }
}
