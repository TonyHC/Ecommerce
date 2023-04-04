import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ShoppingCartDetailsComponent } from './components/shopping-cart-details/shopping-cart-details.component';

const routes: Routes = [
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [OktaAuthGuard] },
  { path: 'shopping-cart', component: ShoppingCartDetailsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:id', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'account', component: AccountInfoComponent, canActivate: [OktaAuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard] },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
