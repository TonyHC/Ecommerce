import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product = new Product();
  currentProductQuantity: number = 0;
  options: any[] = [];

  productSubscription!: Subscription;

  constructor(private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });

    this.options = this.shoppingCartService.populateProductQuantitySelectDropdown();
  }

  handleProductDetails() {
    const productId = +this.route.snapshot.paramMap.get('id')!;

    this.productSubscription = this.productService.fetchProductByProductId(productId).subscribe((responseData) =>
      this.product = responseData
    );
  }

	onAddProductToShoppingCart() {
		let shoppingCartItem = new ShoppingCartItem(this.product);
		shoppingCartItem.quantity = this.currentProductQuantity;

		this.shoppingCartService.addItemToShoppingCart(shoppingCartItem);
	}

  onUpdateProductQuantity(inputEvent: Event) {
		const productQuantity = +(inputEvent.currentTarget as HTMLInputElement).value;
		this.currentProductQuantity = productQuantity;
	}

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
