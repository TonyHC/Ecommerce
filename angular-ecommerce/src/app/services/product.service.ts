import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';

// Unwraps the JSON from Spring Data REST _embedded entry
export interface productResponse {
  _embedded: {
    products: Product[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/products";

  constructor(private httpClient: HttpClient) {

  }

  fetchProducts(categoryId: number): Observable<Product[]> {
    const searchCategoryUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<productResponse>(searchCategoryUrl).pipe(
      map((response) => response._embedded.products)
    );
  }
}
