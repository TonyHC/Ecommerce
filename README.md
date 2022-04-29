# Ecommerce Web App

Full stack web application using Angular 13 and Spring Boot 2

- Angular along with Bootstrap 5, HTML and CSS as the frontend

- Create a REST API using Spring Boot that communicates with MySQL as the backend

- Utilize Okta along with Spring Security for authentication and authorization services

## How to visit web application hosted by Heroku
- Head to https://ecom-store-app.herokuapp.com/products to check out the web application

- Ecommerce web application is hosted on [Heroku](https://devcenter.heroku.com/) with the [ClearDB MySQL](https://devcenter.heroku.com/articles/cleardb) addon to store data on the cloud

## Features
**Regular User**
- View a list of products (pagination implemented with help of [ng-bootstrap](https://ng-bootstrap.github.io/#/home)): 
  - Click on categories listed in navigation sidebar
  - Searching the product's name at searchbar in navigation bar

- Change the number of products displayed on each page (default 10 per page)
  - Click on dropdown on bottom-right corner and select an option

- Adjust how the search result for a list of products gets sorted
  - The default sort is by the product's name in ascending order (*only for searching*)

- Examine the product in more detail by clicking on the product's name or image
  - The remaining quantity information will appear if the remaining product quantity is less than 25 in stock

- Add *x* quantity of a product to the shopping cart from the specific product detail page (from 1 to 10)

- View all the items added to cart in shopping cart page
  - A alert message appears if no products were added to the shopping cart
  - A warning message appears if the quantity for a product exceeds the current stock available and checkout button is disabled

- Update each individual item in shopping cart by either removing the item from cart or by modifying the quantity

- Sign up or login to ecommerce web app through the Okta Sign-In Widget by clicking on the login button found in navigation bar

- Restrict access to checkout, account info and order history page unless your a valid user

<br>**Registered User**

- Checkout page consists of a form containing validators, stopping the user from placing a order unless the entire form is valid

- Account info page displays the basic user information when signed up from Okta Sign-In Widget

- Order history page displays a list of valid orders made in descending order
  - A alert message appears if no orders were made

## How to login to the web application

- Either use an existing account or create a new account through Okta Sign-In Widget used by the web application

- A dummy account for testing with orders already placed is provided below: 
  - `Username: thomas@gmail.com`
  - `Password: testcase`
## How to run web application locally on your machine

- Before downloading this project, must sure your system has JRE 8 or higher installed

- Download the Ecommerce project repository by your preferred means

- Open your preferred OS terminal and head to folder containing the jar file

- Run the command `java -jar eCommerce.jar` and wait for jar to finish executing

- Visit https://localhost:8443 to access the eCommerce web application

- If a `Warning: Potential Security Risk Ahead` message appears, then click Advanced and Accept the Risk and Continue
  - *Note: The reason why a warning message appears is because the app's ssl certificate is self-signed and generated using Java Keytool*