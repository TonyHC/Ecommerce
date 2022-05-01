import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';

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
    return this.httpClient
      .get<productResponse>(`${this.productsUrl}`, { params: new HttpParams().set('size', 100) })
      .pipe(map((response) => response._embedded.products));
  }

  fetchProductsByCategoryId(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByCategoryId`;
    let searchParams = new HttpParams().set('id', categoryId);

    return this.retrieveProducts(searchUrl, searchParams);
  }

  fetchProductsByCategoryIdPaginate(
    currentPage: number,
    currentPageSize: number,
    categoryId: number
  ): Observable<productResponse> {
    let searchParams = new HttpParams({
      fromObject: {
        id: categoryId,
        page: currentPage,
        size: currentPageSize
      }
    });

    return this.httpClient.get<productResponse>(`${this.productsUrl}/search/findByCategoryId`, { params: searchParams });
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
    const searchUrl = `${this.productsUrl}/search/findByNameContaining`;
    let searchParams = new HttpParams().set('keyword', keyword);

    return this.retrieveProducts(searchUrl, searchParams);
  }

  searchProductsByKeywordPaginate(
    currentPage: number,
    currentPageSize: number,
    keyword: string,
    sortField: string,
    sortDirection: string
  ): Observable<productResponse> {
    let searchParams = new HttpParams({
      fromObject: {
        keyword: keyword,
        page: currentPage,
        size: currentPageSize,
        sort: `${sortField},${sortDirection}`,
      }
    })

    return this.httpClient.get<productResponse>(`${this.productsUrl}/search/findByNameContaining`, { params: searchParams });
  }

  private retrieveProducts(searchUrl: string, queryParams: HttpParams): Observable<Product[]> {
    return this.httpClient
      .get<productResponse>(searchUrl, { params: queryParams })
      .pipe(map((response) => response._embedded.products));
  }

  fetchProductByProductId(productId: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}
