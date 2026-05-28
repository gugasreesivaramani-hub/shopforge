# ShopForge

A full-stack e-commerce application built with Node.js, Express, MongoDB, and React.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or Atlas connection)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

The backend will run on `http://localhost:5000` (or the PORT specified in `.env`)

### Deploying Online

This project is now ready to deploy as a single hostable app:

- Use `backend/.env.example` to configure `MONGODB_URI`, `JWT_SECRET`, and `PORT`.
- Use `frontend/.env.example` to configure `VITE_API_URL` to point to your deployed backend.
- Build and serve both frontend and backend together using `Dockerfile`.
- For local container deployment, use `docker-compose.yml` and set environment variables in a root `.env` file.

Example `.env` for local container deployment:

```env
MONGODB_URI=mongodb://mongo:27017/shopforge
JWT_SECRET=your_jwt_secret_here
```

Then run:

```bash
docker compose up --build
```

Your app will be available at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will typically run on `http://localhost:5173`

### Admin User Setup

To create an admin user, connect to MongoDB and insert a document into the `users` collection:

```javascript
db.users.insertOne({
  username: "admin",
  email: "admin@shopforge.com",
  password: "$2a$10$...",  // Use bcryptjs to hash your password
  role: "admin",
  createdAt: new Date()
})
```

Or use a MongoDB GUI tool like MongoDB Compass to create the user manually.

**Note:** The password should be hashed using bcryptjs with `saltRounds: 10`

## Project Structure

```
shopforge/
├── backend/
│   ├── models/          # MongoDB schemas (User, Product, Order)
│   ├── routes/          # API routes (auth, products, orders)
│   ├── middleware/      # Auth middleware (JWT verification)
│   ├── server.js        # Express server entry point
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components (shop, admin, checkout)
│   │   ├── components/  # Reusable components (ProductCard, ProtectedRoute)
│   │   ├── context/     # React context (CartContext)
│   │   ├── App.jsx      # Main app with routing
│   │   └── main.jsx     # React entry point
│   └── package.json     # Frontend dependencies
└── README.md            # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin/stats` - Get admin statistics
- `GET /api/orders/admin/orders` - Get all orders (admin only)
- `GET /api/orders/admin/orders/:id` - Get order details (admin only)
- `PUT /api/orders/admin/orders/:id` - Update order status (admin only)

## Technologies Used

- **Backend:** Node.js, Express, MongoDB, Mongoose, bcryptjs, JWT
- **Frontend:** React, React Router v6, Axios, React Context API

## Features

- User authentication and authorization
- Product catalog with search and filters
- Shopping cart management
- Order placement and tracking
- Admin dashboard with statistics
- Product management (CRUD)
- Order management
