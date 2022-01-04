import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutFormService) {

  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [
          Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.populateMonthsAndYears();
    this.populateCountries();
  }

  onSubmit() {

  }

  copyShippingAddressToBillingAddress(inputEvent: Event) {
    if((inputEvent.currentTarget as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // Sync billing address states with shipping address states
      // Billing address states weren't not in sync with shipping address states
      // when we select the country from shipping address form group
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  populateMonthsAndYears() {
    const currentMonth = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(currentMonth).subscribe(responseData =>
      this.creditCardMonths = responseData
    )

    this.checkoutFormService.getCreditCardYears().subscribe(responseData =>
      this.creditCardYears = responseData
    )
  }

  onHandleMonthsAndYears() {
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = +this.checkoutFormGroup.controls['creditCard'].value.expirationYear;

    let startMonth: number;

    currentYear === selectedYear ? startMonth = new Date().getMonth() + 1 : startMonth = 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(responseData =>
      this.creditCardMonths = responseData
    )
  }

  populateCountries() {
    this.checkoutFormService.getCountries().subscribe(responseData =>
      this.countries = responseData
    )
  }

  onPopulateStates(formGroupName: string) {
    const countryCode: string = this.checkoutFormGroup.controls[formGroupName].value.country.code as string;

    this.checkoutFormService.getStates(countryCode).subscribe(responseData => {
      console.log(JSON.stringify(responseData));

      formGroupName === 'shippingAddress' ?
        this.shippingAddressStates = responseData : this.billingAddressStates = responseData;

        this.checkoutFormGroup.controls[formGroupName].patchValue({state: responseData[0]});
      }
    )
  }

  get customerFirstName() {
    return this.checkoutFormGroup.get('customer.firstName')!;
  }

  get customerLastName() {
    return this.checkoutFormGroup.get('customer.lastName')!;
  }

  get customerEmail() {
    return this.checkoutFormGroup.get('customer.email')!;
  }
}
