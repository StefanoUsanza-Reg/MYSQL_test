# Restock

Software for managing a store's restock.

- [Problem analysis](/README.md#problem-analysis)

- [Functional analysis](/README.md#functional-analysis)

- [Functions](/README.md#functions)

- [Technologies used](/README.md#technologies-used)

- [User guide](/README.md#user-guide)


## Problem analysis

your shop sell products at a fix prices, but when you need to restock from supplier, you want to choose the cheapest one based on the selling prices and discounts they offer.
The discount they offer may be related to:
- the quantity of the product request
- the total amount of the order
- or may be limited to certain periods of the year

You can also choose supplier based on the minimun days to ship the order in case an urgent delivery is required.

## Functional analysis
<b>AS</b> store owner

<b>I WANT</b> check the prices of a product offered by different suppliers

<b>SO THAT</b> when I have to make a product’s restock, I can choose whether to buy from the cheapest supplier, or from the fastest to deliver the order

<i>(SCENARIO 1:)</i>

<b>GIVEN</b> An order of 12 Philips monitor 17” made on September 24, priority Economic

<b>WHEN</b> Supplier 1 has 8pcs in stock at 120€ each, and offers 5% discount for purchases of minimum 1000€. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 15pcs in stock at 128€ each, and offers a 3% discount if you order >5pcs and 5% discount if you order >10pcs. Min. days to ship order is 7
  
<b>AND</b> Supplier 3 has 23pcs in stock at 129€ each, and offers a discount of 5% for orders over 1000€. It also offers an additional discount of 2% for orders placed in september.. Min. days to ship order is 4

<b>THEN</b> 
- Supplier 1 is not prompted because it does not have enough stock quantity available.
- Supplier 2 can fulfill the request for 1459.20€.
- Supplier 3 can fulfill the request for 1441.19€; this is the cheapest one so it should be highlighted.


<i>(SCENARIO 2:)</i>

<b>GIVEN</b> An order of 12 Philips monitor 17” made on November 3, priority Economic

<b>WHEN</b> Supplier 1 has 8pcs in stock at 120€ each, and offers 5% discount for purchases of minimum 1000€. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 15pcs in stock at 128€ each, and offers a 3% discount if you order >5pcs and 5% discount if you order >10pcs. Min. days to ship order is 7
  
<b>AND</b> Supplier 3 has 23pcs in stock at 129€ each, and offers a discount of 5% for orders over 1000€. It also offers an additional discount of 2% for orders placed in september. Min. days to ship order is 4

<b>THEN</b> 
- Supplier 1 is not prompted because it does not have enough stock quantity available.
- Supplier 2 can fulfill the request for 1459.20€; this is the cheapest one so it should be highlighted.
- Supplier 3 can fulfill the request for 1470.60€.

<i>(SCENARIO 3:)</i>

<b>GIVEN</b> An order of 5 office chairs made on September 24, priority Fast

<b>WHEN</b> Supplier 1 has 10pcs in stock at 110€ each, and offers 5% discount for purchases of minimum 1000€. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 8pcs in stock at 100€ each, and offers a 3% discount if you order >5pcs and 5% discount if you order >10pcs. Min. days to ship order is 7

<b>AND</b> Supplier 3 has 15pcs in stock at 120€ each, and offers a discount of 5% for orders over 1000€ and 2% if you order >5pcs. It also offers an additional discount of 2% for orders placed in september. Min. days to ship order is 4

<b>THEN</b>
- Supplier 1 can fulfill the request shipping the order in 5 days for 550€
- Supplier 2 can fulfill the request shipping the order in 7 days for 485€.
- Supplier 3 can fulfill the request shipping the order in 4 days for 576€. this is the fastest one so it should be highlighted.

<i>(SCENARIO 4:)</i>

<b>GIVEN</b>  An order of 8 mechanical keyboards made on September 24, priority Economic

<b>WHEN</b> Supplier 1 has 20pcs in stock at 50€ each. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 30pcs in stock at 55€ each. Min. days to ship order is 7

<b>AND</b> Supplier 3 has 25pcs in stock at 50€ each. Min. days to ship order is 4

<b>THEN</b>
- Supplier 1 can fulfill the request for 400€, Min. days to ship order is 5
- Supplier 2 can fulfill the request for 440€, Min. days to ship order is 7
- Supplier 3 can fulfill the request for 400€, Min. days to ship order is 4. This is the cheapest one and the fastest one so it should be highlighted.

### Functions

- <b>Login/logout:</b>

To access the functionality of the site, you need to authenticate. Through a log-in screen only operators who have been assigned a valid account can access; without logging in you cannot access any of the features. The username and password of the user are saved in a database; to avoid exposing passwords to those who use the database, or to people who try to attack our system, we need to encode passwords before saving them in the database. Through a hashing function you can generate a hash for the password, at this point the only way to check if the password entered during the login phase is correct, is to use a function compare(), because once encoded it is not possible to trace the password in clear text, but only verify if the hash analaysed was generated by that password.

Once logged in, the user’s session will be saved allowing him to access all functions of the site; if you want to change accounts, or simply terminate the current session, there is a logout button: the user will be redirected to the login page and will have to enter again the correct data to authenticate.

- <b>Find a supplier</b>

By entering the data relating to the name of a product and the desired quantity, the user can view a list of all supplier that can meet the request; the order in which they are displayed is based on the priority set by the user: Economic or Fast. To show the user the list of supplier, the server must recive a request containing all the necessary data, so if the user doesn't compile the form, the requst is not sent and an error message will be displayed; in the same way, if no supplier that meet the request are found, an error message will be displayed.

To speed up the data entry, and limit errors due to manual writing, product names are automatically entered into the form, and the user only has to select the desired one; To do so, it's sufficient to make a request to the server when the page is loaded.

- <b>Order/profit</b>

The user can always choose the supplier ho prefers, even though it's not the one highlighted by the system; for this reason there is a button next to each supplier that allows to conclude the order with that specific supplier. Once the order is confirmed, the price at which the items will be sold, the purchase price, and the possible profit by selling the entire order will be shown. At this point the user can return to the form to enter new data and perform a new search or log out and return to the login screen.

## Technologies used

- Node.js
- package manager: npm

### Dependencies

- Database: [MYSQL](https://github.com/mysqljs/mysql#readme)
- Data encryption: [Bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)
- Server: [Express](http://expressjs.com/)
- Test framework: [Mocha](https://mochajs.org/)
- TDD/BDD Test assertion library: [Chai](https://www.chaijs.com/)

## User guide
To access the service you need to authenticate; accounts must be distributed to authorized operators, who can not choose to create new ones. Once logged in, the user’s session will be saved allowing him to access all functions of the site; if you want to change accounts, or simply terminate the current session, there is a logout button: the user will be redirected to the login page and will have to enter again the correct data to authenticate. When you want to place a Restock order, it is sufficient to enter the name of the product and the desired quantity in the form, specifying the priority for the search:

- Economic, if you want to find the cheapest supplier
- Fast, if you want the fastest supplier to ship the order

To speed up the data entry, and limit errors due to manual writing, product names are automatically entered into the form, and the user only has to select the desired one, the same applies to the types of priorities.

![Screenshot (19)](https://user-images.githubusercontent.com/90613113/135849690-62eee038-2f4d-4813-b21d-d921360ab98c.png)

With the data entered in the form will be made a request to the server where is located the database that contains all the data relating to the products that can be ordered and the suppliers that offer them. After applying the available discounts, a list is displayed with all suppliers that are able to meet the demand for Restock; If more products are selected than are available for a supplier, this will not be shown.

Based on the selected search priority will be highlighted the most appropriate suppliers:

- Economic, the supplier offering the lowest price is highlighted, and in case of more equal prices, the fastest will be chosen to deliver.
- Fast, the dealer that offers the fastest shipment is highlighted, and in case of equal timing, the cheapest will be chosen.

![Screenshot (18)](https://user-images.githubusercontent.com/90613113/135849755-1dc4eb78-b600-4810-b284-e2afd2e66674.png)

The user can always choose the supplier ho prefers, even though it's not the one highlighted by the system; for this reason there is a button next to each supplier that allows to conclude the order with that specific supplier. Once the order is confirmed, the price at which the items will be sold, the purchase price, and the possible profit by selling the entire order will be shown. At this point the user can return to the form to enter new data and perform a new search or log out and return to the login screen.

![Screenshot (20)](https://user-images.githubusercontent.com/90613113/135850530-300ec8cf-8722-4188-a24f-57c6d4e4382a.png)

