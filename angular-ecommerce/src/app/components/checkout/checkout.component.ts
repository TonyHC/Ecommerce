import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { notOnlyWhiteSpace } from 'src/app/shared/forbidden-whitespace.directive';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  validCardNumber: boolean = false;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutFormService,
    private shoppingCartService: ShoppingCartService,
    private checkoutService: CheckoutService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.initCheckoutForm();
    this.reviewShoppingCartDetails();
    this.populateMonthsAndYears();
    this.populateCountries();
  }

  reviewShoppingCartDetails() {
    this.shoppingCartService.totalPrice.subscribe(responseData => this.totalPrice = responseData)
    this.shoppingCartService.totalQuantity.subscribe(responseData =>this.totalQuantity = responseData)
  }

  initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        email: new FormControl(JSON.parse(this.storage.getItem('userEmail')!), [
          Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-zA-Z]{2,4}$')
        ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        state: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        country: new FormControl('', Validators.required)
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        state: new FormControl('', Validators.required),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        country: new FormControl('', Validators.required)
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), notOnlyWhiteSpace()]),
        cardNumber: new FormControl('', [Validators.required]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }

  onSubmit() {
    // Setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Get shopping cart items
    const shoppingCartItems = this.shoppingCartService.shoppingCartItems;

    // Convert shoppingCartItem array into orderItems array
    let orderItems: OrderItem[] = shoppingCartItems.map(shoppingCartItem => new OrderItem(shoppingCartItem));

    // Initialize Purchase
    let purchase = new Purchase();

    // Populate customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Populate shipping and billing address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    // Equivalent to this.checkoutFormGroup.controls['shippingAddress'].value.state.name.toString();
    purchase.shippingAddress.state = JSON.parse(JSON.stringify(purchase.shippingAddress.state)).name;
    // Equivalent to this.checkoutFormGroup.controls['shippingAddress'].value.country.name.toString();
    purchase.shippingAddress.country = JSON.parse(JSON.stringify(purchase.shippingAddress.country)).name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    purchase.billingAddress.state = JSON.parse(JSON.stringify(purchase.billingAddress.state)).name;
    purchase.billingAddress.country = JSON.parse(JSON.stringify(purchase.billingAddress.country)).name;

    // Populate order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Call REST API via checkout service
    this.checkoutService.placeOrder(purchase).subscribe({
        next: responseData => {
          console.log("Order tracking number: " + JSON.stringify(responseData.orderTrackingNumber));

          // Reset the shopping cart
          this.resetShoppingCart();
        },
        error: err => {
          console.log("Error: " + err.message);
        }
      }
    )
  }

  resetShoppingCart() {
    // Reset the shopping cart data
    this.shoppingCartService.shoppingCartItems = [];
    this.shoppingCartService.totalPrice.next(0);
    this.shoppingCartService.totalQuantity.next(0);

    // Reset checkout form
    this.checkoutFormGroup.reset();

    // Navigate back to products page
    this.router.navigateByUrl("/products");
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

    this.checkoutFormService.getCreditCardMonths(currentMonth).subscribe(responseData => this.creditCardMonths = responseData);
    this.checkoutFormService.getCreditCardYears().subscribe(responseData => this.creditCardYears = responseData);
  }

  onHandleMonthsAndYears() {
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = +this.checkoutFormGroup.controls['creditCard'].value.expirationYear;

    let startMonth: number;
    currentYear === selectedYear ? startMonth = new Date().getMonth() + 1 : startMonth = 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(responseData => this.creditCardMonths = responseData);
  }

  populateCountries() {
    this.checkoutFormService.getCountries().subscribe(responseData => this.countries = responseData);
  }

  onPopulateStates(formGroupName: string) {
    const countryCode: string = this.checkoutFormGroup.controls[formGroupName].value.country.code as string;

    this.checkoutFormService.getStates(countryCode).subscribe(responseData => {
        formGroupName === 'shippingAddress' ?
          this.shippingAddressStates = responseData : this.billingAddressStates = responseData;

        this.checkoutFormGroup.controls[formGroupName].patchValue({state: responseData[0]});
      }
    )
  }

  onValidCardNumber(cardNumber: string): void {
    this.validCardNumber = this.checkoutFormService.validCreditCardNumber(cardNumber);
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

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street')!;
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city')!;
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state')!;
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode')!;
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country')!;
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street')!;
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city')!;
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state')!;
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode')!;
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country')!;
  }

  get creditCardCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType')!;
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard')!;
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber')!;
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode')!;
  }
}
