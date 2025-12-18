# Project Name

Assignment 

---

## Table of Contents

- [Client Routes](#client-routes)
- [Server Routes](#server-routes)
- [Installation](#installation)


---

## Server Routes

### Auth Routes

| Method | Route           | Description                   |
|--------|----------------|-------------------------------|
| POST   | /auth/signup    | Register a new user           |
| POST   | /auth/login     | Login an existing user        |
| POST   | /auth/verify-otp| Verify OTP for a user         |

### Product Routes

| Method | Route                     | Description                                  |
|--------|---------------------------|----------------------------------------------|
| POST   | /product/create-product   | Create a new product                         |
| GET    | /product/all              | Get all products of logged-in user           |
| GET    | /product/published        | Get all published products of logged-in user |
| DELETE | /product/:id              | Delete a product by ID                       |
| PATCH  | /product/:id/publish      | Publish a product                            |
| PUT    | /product/:id/edit         | Update a product by ID                       |

---

## Folder Structure

### client

```
client/
├── public/
├── src/
│   ├── assets/   
│   ├── components/   # UI components (Navbar, Sidebar, UI, etc.)
│   ├── lib/          # Utility functions
│   ├── pages/        # Page components 
```


### Server

```
server/
├── src/
│   ├── controller/   # Route controllers
│   ├── database/     # DB connection
│   ├── model/        # Mongoose models
│   ├── routes/       # Express routes
```


## Prerequisites
- Node.js and npm installed.
- MongoDB connection string.


### Server
1. Navigate to `server/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add a `.env` file with:
   ```
   JWT_SECRET_KEY="your_secret_key"
   MONGODB_URI="your_mongo_db_url"
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Client
1. Navigate to `client/`.
2. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```


