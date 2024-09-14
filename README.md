# POS Server

This is a backend application for a Point of Sale (POS) system that manages items, sales, and users. The application is built using Node.js, Express.js, and MongoDB. It provides functionalities for adding, retrieving, and managing sales, items, users, and their relationships.

## Features

- **Sales Management**: Record and retrieve sales with filtering options based on product, date, and user.
- **Item Management**: Add, update, and retrieve items, including item sales statistics and percentages.
- **User Authentication**: User registration, login, and role-based access control (Admin and Employee).
- **Pfand Handling**: Handle Pfand (deposit) for orders.
- **Statistics and Filtering**: Get sales data for a specific user, filter sales by date and items, and calculate sales percentages by users and products.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB (with Mongoose ORM)**
- **JWT for Authentication**
- **bcrypt for Password Hashing**
- **Express-validator for Input Validation**

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (version 16 or higher)
- MongoDB (either installed locally or using a service like MongoDB Atlas)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Lamboserker/PosServer.git
   cd PosServer
´´´

2. Install the dependencies:
```
npm install
```

3. Set up environment variables by creating a .env file in the root of the project and adding the following:
```
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

4. Start the server:
```
npm start
```

The server will start on port 5000 by default. You can configure the port by adding a PORT variable to your .env file.

## API Endpoints

# Sales

- ```GET /sales:``` Retrieve sales, optionally filtered by product.
- ```POST /sales:``` Record a sale. Requires userId, productId, count, and amount in the body.
- ```POST /sales/search:``` Search sales by startDate, endDate, and selected items.
- ```GET /sales/count:``` Get the total number of sales.
- ```GET /sales/items-data:``` Get sales data grouped by items.
- ```GET /sales/by-user/:``` Get all sales by a specific user.
- ```DELETE /sales/:``` Delete a sale by its ID.
- ```POST /sales/filter-by-users:``` Filter sales by a list of user IDs.
- ```POST /sales/percentage-by-users:``` Get sales percentage by users, filtered by date.

# Items

- ```POST /items:``` Add a new item. Requires name, type, price, and image (optional).
- ```GET /items:``` Retrieve all items.
- ```GET /items/images:``` Retrieve all items with their associated images.
- ```POST /items/add-pfand:``` Add Pfand (3€) to an order. Requires orderId in the body.

# Users

- ```POST /users/register:``` Register a new user. Requires name, password, and role (optional).
- ```POST /users/login:``` Log in a user. Requires name and password.
- ```POST /users/get-names:``` Retrieve usernames by a list of user IDs.

## License

This project is licensed under the MIT License.
