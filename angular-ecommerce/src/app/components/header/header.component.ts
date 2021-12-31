import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private router: Router,
    private shoppingCartService: ShoppingCartService) {

  }

  ngOnInit(): void {
    this.updateShoppingCartStatus();
  }

  onSearchProducts(keyword: string) {
    this.router.navigateByUrl(`search/${keyword}`);
  }

  updateShoppingCartStatus() {
    this.shoppingCartService.totalQuantity.subscribe(
      responseData => this.totalQuantity = responseData
    )
  }
}
