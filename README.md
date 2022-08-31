# Ecommerce Web App

Full stack web application using Angular 13 and Spring Boot 2

- Angular with Bootstrap 5, HTML, and CSS as the frontend

- Create a REST API using Spring Boot that communicates with MySQL as the backend

- Utilize Okta along with Spring Security for authentication and authorization services

## How to run this web application and its required services on Docker

**Prerequisites**
- Clone or download this repository through your preferred method

- Make sure you have Docker or Docker Desktop installed on your machine

- Open your preferred terminal and change to the directory containing the docker-compose.yml
	- Enter the following Docker command: `docker compose up -d` to create the required containers
	- Wait for the containers to be built and finish running

<br>**Docker containers are up and running**
- Visit [phpMyAdmin](http://localhost:8080) to access the GUI for MySQL and log in with the following credentials:
	- `Username: root`
	- `Password: password`

- Head to [eCommerce](http://localhost:8443) to access the web application

## How to visit the web application hosted by Heroku
- Head to https://ecom-store-app.herokuapp.com/products to check out the web application

- The eCommerce web application is hosted on [Heroku](https://devcenter.heroku.com/) with the [ClearDB MySQL](https://devcenter.heroku.com/articles/cleardb) addon to store data on the cloud

## Features
**Regular User**
- View a list of products (pagination implemented with the help of [ng-bootstrap](https://ng-bootstrap.github.io/#/home)): 
  - Click on categories listed in the navigation sidebar
  - Searching the product's name through the search bar in the navigation bar

- Change the number of products displayed on each page (default 10 per page)
  - Click on the dropdown in the bottom-right corner and select an option

- Adjust how the search result for a list of products gets sorted
  - The default sort is by the product's name in ascending order (*only for searching*)

- Examine the product in more detail by clicking on the product's name or image
  - The remaining quantity information will appear if the remaining product quantity is less than 25 in stock

- Add *x* quantity of a product to the shopping cart from the specific product detail page (from 1 to 10)

- View all the items added to the cart on the shopping cart page
  - An alert message appears if the shopping cart is empty
  - A warning message appears if the quantity for a product exceeds the current stock available and the checkout button is disabled

- Update each item in the shopping cart by either removing the item from the cart or modifying the quantity

- Sign up or log in to the eCommerce web app through the Okta Sign-In Widget by clicking on the login button found in the navigation bar

- Restrict access to checkout, account info, and order history page unless you are a valid user

<br>**Registered User**

- The Checkout page consists of a form containing validators, stopping the user from placing an order unless the checkout form is valid

- The account info page displays the basic user information when signed up from Okta Sign-In Widget

- The order history page displays the valid orders made in descending order
  - An alert message appears if no orders are associated with the customer

## How to login to the web application

- Either use an existing account or create a new account through Okta Sign-In Widget used by the web application

- Use the following dummy account credentials to test the registered user features:
  - `Username: thomas@gmail.com`
  - `Password: testcase`
