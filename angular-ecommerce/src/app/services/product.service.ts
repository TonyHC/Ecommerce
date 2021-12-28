import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

// Unwraps the JSON from Spring Data REST _embedded entry
export interface productResponse {
  _embedded: {
    products: Product[];
  }
}

export interface productCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) {

  }

  fetchProductsByCategoryId(categoryId: number): Observable<Product[]> {
    const searchCategoryUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<productResponse>(searchCategoryUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  fetchProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<productCategoryResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  fetchProductCategoryByCategoryId(categoryId: number): Observable<ProductCategory> {
    const searchProductCategoryUrl = `${this.categoryUrl}/${categoryId}`;

    return this.httpClient.get<ProductCategory>(searchProductCategoryUrl).pipe(
      map(response => response)
    )
  }
}
