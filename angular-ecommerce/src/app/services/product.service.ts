import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

// Unwraps the JSON from Spring Data REST _embedded entry
export interface productResponse {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface productCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = environment.ecommerceApiUrl + '/products';
  private categorysUrl = environment.ecommerceApiUrl + '/product-category';

  constructor(private httpClient: HttpClient) {}

  fetchProductsPaginate() {
    const searchUrl = `${this.productsUrl}?size=100`;

    return this.httpClient
      .get<productResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  fetchProductsByCategoryId(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.retrieveProducts(searchUrl);
  }

  fetchProductsByCategoryIdPaginate(
    currentPage: number,
    currentPageSize: number,
    categoryId: number
  ): Observable<productResponse> {
    const searchUrl =
      `${this.productsUrl}/search/findByCategoryId?id=${categoryId}` +
      `&page=${currentPage}&size=${currentPageSize}`;

    return this.httpClient.get<productResponse>(searchUrl);
  }

  fetchProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<productCategoryResponse>(this.categorysUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  fetchProductCategoryById(categoryId: number): Observable<ProductCategory> {
    const searchUrl = `${this.categorysUrl}/${categoryId}`;

    return this.httpClient.get<ProductCategory>(searchUrl);
  }

  searchProductsByKeyword(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByNameContaining?keyword=${keyword}`;

    return this.retrieveProducts(searchUrl);
  }

  searchProductsByKeywordPaginate(
    currentPage: number,
    currentPageSize: number,
    keyword: string,
    sortField: string,
    sortDirection: string
  ): Observable<productResponse> {
    const searchUrl =
      `${this.productsUrl}/search/findByNameContaining?keyword=${keyword}` +
      `&page=${currentPage}&size=${currentPageSize}&sort=${sortField},${sortDirection}`;

    return this.httpClient.get<productResponse>(searchUrl);
  }

  private retrieveProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<productResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  fetchProductByProductId(productId: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}
