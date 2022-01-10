import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, } from 'rxjs/operators';
import { Product } from 'src/app/common/product';
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

  constructor(private router: Router,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductService) {

  }

  ngOnInit(): void {
    this.updateShoppingCartStatus();
    this.initSearchBarTypehead();
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
}
