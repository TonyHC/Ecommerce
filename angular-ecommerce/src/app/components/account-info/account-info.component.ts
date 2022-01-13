import { Component, OnInit } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  userName!: string;
  userEmail!: string;

  constructor(private oktaAuth: OktaAuth) {

  }

  ngOnInit(): void {
    this.oktaAuth.getUser().then(
      user => {
        this.userName = user.name as string;
        this.userEmail = user.email as string;
      }
    );
  }

}
