# Project Title

## Description
This application is designed to manage products, categories, and orders efficiently. It provides a user-friendly interface to facilitate the management of these entities.

## Installation
To install this application, follow these steps:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd technicaltest_MERN
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage
To run the application, use the following command:
```bash
npm start
```

Once the application is running, you can access it in your browser at `http://localhost:3000`.

### Features
- **Product Management**: Add, edit, and delete products.
- **Category Management**: Organize products into categories.
- **Order Management**: Process customer orders efficiently.

## Technology Stack

This application is built using the following technologies:

- **Frontend**: React (with JSX)
  - The frontend is developed using React, a popular JavaScript library for building user interfaces. JSX is used for templating, allowing for a more readable and expressive syntax when creating UI components.

- **Backend**: Node.js, Express, MongoDB
  - The backend is built on Node.js, a JavaScript runtime that allows for server-side development. Express is used as the web application framework, providing robust features for building web and mobile applications. MongoDB is utilized as the database to store application data, offering a flexible and scalable solution.

## Detailed Usage

### Backend Usage

The backend of the application is built using Node.js and Express. To set up and run the backend:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

The backend server will run on `http://localhost:5000` by default. You can interact with the API endpoints using tools like Postman or directly from the frontend.

### Frontend Usage

The frontend of the application is built using React. To set up and run the frontend:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` by default. You can access the application in your browser and interact with the various features provided by the UI.

## Router Explanations

### Products Router
- **`/products`**: Displays a list of all products.
- **`/products/new`**: Provides a form to add a new product.
- **`/products/:id`**: Displays details for a specific product based on its ID.
- **`/products/edit/:id`**: Allows editing of an existing product's details.

### Categories Router
- **`/categories`**: Shows a list of all categories.
- **`/categories/new`**: Provides a form to add a new category.
- **`/categories/:id`**: Displays details for a specific category based on its ID.
- **`/categories/edit/:id`**: Allows editing of an existing category's details.

### Orders Router
- **`/orders`**: Displays a list of all orders.
- **`/orders/new`**: Provides a form to create a new order.
- **`/orders/:id`**: Displays details for a specific order based on its ID.
- **`/orders/edit/:id`**: Allows editing of an existing order's details.

### Users Router
- **`/users`**: Displays a list of all users.
- **`/users/new`**: Provides a form to add a new user.
- **`/users/:id`**: Displays details for a specific user based on its ID.
- **`/users/edit/:id`**: Allows editing of an existing user's details.

### Account Router
- **`/account`**: Displays the user's account details.
- **`/account/edit`**: Provides a form to edit the user's account information.
- **`/account/settings`**: Allows the user to change account settings such as password and notification preferences.
- **`/account/orders`**: Displays a list of orders associated with the user's account.

### Dashboard Router
- **`/dashboard`**: Displays a dashboard for the application.
- **`/dashboard/stats`**: Displays statistics for the application.
- **`/dashboard/settings`**: Allows editing of application settings.

## Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the contributors and the community for their support.

---

Feel free to reach out for any questions or feedback!
