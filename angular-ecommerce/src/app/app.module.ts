import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ShortenPipe } from './pipe/shorten.pipe';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductListComponent } from './components/product-list/product-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    HeaderComponent,
    SidebarComponent,
    ShortenPipe,
    ProductCategoryMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
