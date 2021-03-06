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
      })
      .pipe(
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

  validCreditCardNumber(cardNumber: string) {
    // Only allow numbers, dash or space
    if (/[^0-9-\s]+/.test(cardNumber))
      return false;

    // The Luhn Algorithm
    var nCheck = 0, nDigit = 0, bEven = false;
    cardNumber = cardNumber.replace(/\D/g, "");

    for (var n = cardNumber.length - 1; n >= 0; n--) {
      var cDigit = cardNumber.charAt(n),
      nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

        nCheck += nDigit;
        bEven = !bEven;
      }

      return (nCheck % 10) == 0;
  }
}
