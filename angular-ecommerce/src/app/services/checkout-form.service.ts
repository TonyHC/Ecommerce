import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Country } from '../models/country';
import { State } from '../models/state';

export interface countriesResponse {
  _embedded: {
    countries: Country[];
  }
}

export interface statesResponse {
  _embedded: {
    states: State[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {
  private countriesUrl = environment.ecommerceApiUrl + '/countries';
  private statesUrl = environment.ecommerceApiUrl + '/states';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<countriesResponse>(this.countriesUrl).pipe(
      map(responseData => responseData._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.http.get<statesResponse>(`${this.statesUrl}/search/findByCountryCode`, {
        params: new HttpParams().set('code', countryCode)
      }).pipe(
        map(responseData => responseData._embedded.states)
      );
  }
}
