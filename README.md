# Ecommerce Web App

Full stack web application built using Angular 14 and Spring Boot 2

- Angular with Bootstrap 5, HTML, and CSS as the frontend

- Create a REST API using Spring Boot that communicates with MySQL as the backend

- Utilize [Okta](https://www.okta.com/?utm_source=google&utm_campaign=amer_mult_usa_all_wf-all_dg-ao_a-wf_search_google_text_kw_workforce-OktaBrand-exact_utm2&utm_medium=cpc&utm_id=aNK4z0000004DlbGAE&utm_term=okta&utm_page={url}&utm_content=325223548748&gclid=EAIaIQobChMIy5Dc8PCQ_gIVh8mGCh2mawv2EAAYASAAEgJEkfD_BwE) along with Spring Security for authentication and authorization services

## How to run this web application and its required services on Docker

**Prerequisites**
- Clone or download this repository through your preferred method

- Make sure you have Docker or Docker Desktop installed on your machine

- Open a terminal and change to the **spring-boot-ecommerce** directory containing the *docker-compose.yml*
	- Enter the following Docker command: `docker compose up -d` to create the required containers
	- Wait for the containers to be creaated and finish running

<br>**Docker containers are up and running**
- Visit [phpMyAdmin](http://localhost:8080) to access the GUI for MySQL and log in with the following credentials:
	- `Username: root`
	- `Password: password`

- Head to [eCommerce](http://localhost:8443) to access the web application

## How to login to the web application

- Use an existing account or create a new account through Okta Sign-In Widget

- A dummy account for testing the registered user features:
  - `Username: thomas@gmail.com`
  - `Password: testcase`

## Features
**Regular User**
- View a list of products (pagination implemented with the help of [ng-bootstrap](https://ng-bootstrap.github.io/#/home)): 
  - Click on categories listed in the navigation sidebar
  - Searching the product name through the search bar in the navigation bar

- Change the number of products displayed on each page (*default option is 10*)
  - Click on the dropdown in the bottom-right corner and select an option

- Adjust how the search results for a list of products get sorted
  - The default sort is by the product name in ascending order (*only for searching*)

- Examine the product in more detail by clicking on the product name or image
  - The remaining product stock will appear if the current stock available is less than 25

- Add *x* quantity of a product to the shopping cart from the specific product detail page (*from 1 to 10*)

- View all the items added to the cart on the shopping cart page
  - An alert message appears if the shopping cart is empty
  - A warning message appears if the number of products added exceeds the current stock available
  - The checkout button is disabled as a result of the above case

- Update each item in the shopping cart by either removing the item from the cart or modifying the quantity

- Sign up or log in to the eCommerce web app through the Okta Sign-In Widget

- Restrict access to checkout, account info, and order history page unless you are a valid user

<br>**Registered User**

- The checkout page contains a form with validators to prevent placing an order unless the checkout form is valid

- The account info page displays the basic user information when signed up from Okta Sign-In Widget

- The order history page displays the orders made in descending order
  - An alert message appears if no orders are associated with the customer