# Ecommerce Web App

Full stack application using Angular and Spring Boot

- Angular as the frontend

- Create a REST API using Spring Boot that communicates with MySQL as the backend

- Utilize Okta along with Spring Security for authentication and authorization services

## Features

- View a list of products through its category in navigation sidebar or by searching the product's name at searchbar in navigation header

- Change the number of products displayed on each page (*both clicking on category or searching product name has this feature*)

- Adjust how the search results for products gets sorted. The default sort is by the product's name in ascending order (*only for searching*)

- Examine the product in more detail by clicking on the product's name or image. The remaining quantity information will appear if the product quantity has less than 26 in stock

- Add *x* quantity of a product to the shopping cart from the specific product detail page

- View all the items added to cart in shopping cart page. A warning message appears if the quantity for a particular products exceeds the current stock available and the checkout button is disabled

- Update each individual item in shopping cart by either removing the item from cart or by modifying the quantity

- Sign up or login to ecommerce app through the Okta Sign-In Widget by clicking on the login button found in navigation header

- Restrict access to checkout, account info and order history page unless your a valid user

- Checkout page consists of a form containing validators, stopping the user from placing a order unless the entire form is valid

- Account info page displays the basic user information when signed up from Okta Sign-In Widget

- Order history page displays a list of valid orders made in descending order. A message appears if no orders were made

## How to run application

- Before downloading this project, must sure your system has JRE 8 or higher installed

- Download the Ecommerce project repository by your preferred means

- Open your preferred OS terminal and head to folder containing the jar file

- Run the command `java -jar eCommerce.jar` and wait for jar to finish executing

- Visit https://localhost:8443 to access the eCommerce web application

- If a `Warning: Potential Security Risk Ahead` message appears, then click Advanced and Accept the Risk and Continue. By doing so, we finally reach the web app

- *Note: The reason why a warning message appears is because the app's ssl certificate is self-signed and generated using Java Keytool*

## How to login to the application

- Either use an existing account or create a new account through Okta Sign-In Widget used by the application

- A dummy account for testing with orders already placed is provided below: 
  - `Username: thomas@gmail.com`
  - `Password: testcase`

