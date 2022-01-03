import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

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
  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<countriesResponse>(this.countriesUrl).pipe(
      map(responseData => responseData._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.http.get<statesResponse>(searchStatesUrl).pipe(
      map(responseData => responseData._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let months: number[] = [];

    for(let currentMonth = startMonth; currentMonth <= 12; currentMonth++) {
      months.push(currentMonth);
    }

    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {
    let years: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
      years.push(currentYear);
    }

    return of(years);
  }
}
