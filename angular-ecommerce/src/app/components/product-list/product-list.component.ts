import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private productService: ProductService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    // Check if "id" parameter exists
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // Get the "id" parameter string and convert string to a number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      // The "id" parameter does not exist, default to category id: 1
      this.currentCategoryId = 1;
    }

    // Now we get the list of products based on the category id
    this.productService.fetchProducts(this.currentCategoryId).subscribe((responseData) => {
      this.products = responseData;
    })
  }
}
