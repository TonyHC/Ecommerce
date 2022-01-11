import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ShortenPipe } from './pipe/shorten.pipe';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ShoppingCartDetailsComponent } from './components/shopping-cart-details/shopping-cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { notOnlyWhiteSpaceValidatorDirective } from './shared/forbidden-whitespace.directive';
import { LoginComponent } from './components/login/login.component';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import AppConfig from './app.config';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    HeaderComponent,
    SidebarComponent,
    ShortenPipe,
    ProductCategoryMenuComponent,
    ProductDetailsComponent,
    ShoppingCartDetailsComponent,
    CheckoutComponent,
    notOnlyWhiteSpaceValidatorDirective,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [
    {
      provide: OKTA_CONFIG,
      useFactory: () => {
        const oktaAuth = new OktaAuth(AppConfig.oidc);
        return {
          oktaAuth,
          onAuthRequired: (injector: Injector) => {
            const router = injector.get(Router);
             // Redirect the user to your custom login page
            router.navigate(['/login']);
          }
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
