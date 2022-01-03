import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): number[] {
    let months: number[] = [];

    for(let currentMonth = startMonth; currentMonth <= 12; currentMonth++) {
      months.push(currentMonth);
    }

    return months;
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
