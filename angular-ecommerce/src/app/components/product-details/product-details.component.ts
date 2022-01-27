import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ShoppingCartItem } from 'src/app/common/shopping-cart-item';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: Product;

  productSubscription!: Subscription;

  constructor(private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    const productId = +this.route.snapshot.paramMap.get('id')!;

    this.productSubscription = this.productService.fetchProductByProductId(productId).subscribe((responseData) =>
      this.product = responseData
    );
  }

  onAddProductToShoppingCart() {
    const shoppingCartItem = new ShoppingCartItem(this.product);
    this.shoppingCartService.addItemToShoppingCart(shoppingCartItem);
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
