import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
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
}
