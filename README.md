# Subscription Management Backend

A robust backend API for a premium content platform where users must have an active subscription to access protected content. Built with Node.js, Express, and PostgreSQL (Sequelize).

## Features

- User authentication (Register/Login) with roles (`Free` and `Premium`).
- Subscription plan management and subscription upgrade simulation.
- Middleware protecting premium content. Only `Premium` users can access.
- Activity logging capturing request details (IP, user agent) for analytics.
- Automatic subscription expiration handling (downgrades user back to `Free`).
- Generate monthly access logs in CSV format for admin.
- Docker support for local deployment.

## Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL
- Docker & Docker Compose (optional, for containerized run)

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/subscription
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=admin123
```

*(Note: If using Docker Compose, you don't need to specify DATABASE_URL, it natively connects via container domain configs)*

## Setup and Run Locally

### Using Node.js directly

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the PostgreSQL service locally on your machine.
   *Important*: You must create the database before starting the application for the first time:
   ```bash
   psql -U postgres -d postgres -c "CREATE DATABASE subscription;"
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

4. View the Swagger API Documentation directly in your browser:
   **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Using Docker & Docker Compose

To run the application and a PostgreSQL instance entirely in Docker:

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. The server will be accessible at `http://localhost:3000`
3. The API documentation will be generated and served at `http://localhost:3000/api-docs`

## Example API Requests

### 1. Register a Free User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Response includes setting the JWT in an HTTP-only cookie
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Attempt to Access Premium Content (as Free user)
*(Requires cookie from login)*
```bash
curl -X GET http://localhost:3000/content/premium \
  -b "token=YOUR_COOKIE_HERE"

# Expected Response (403 Forbidden):
# { "error": "Premium subscription required to access this resource" }
```

### 4. Admin Logs In
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 5. Admin Creates a Plan
```bash
curl -X POST http://localhost:3000/admin/plans \
  -b "adminToken=YOUR_ADMIN_COOKIE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pro Plan",
    "price": 9.99,
    "features": ["Feature A", "Feature B"],
    "duration": 30
  }'
# Returns the new planId
```

### 6. Upgrade User to Premium
```bash
curl -X POST http://localhost:3000/subscriptions/upgrade \
  -b "token=YOUR_COOKIE_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "PLAN_ID_FROM_ABOVE",
    "paymentMethodToken": "tok_visa_simulation"
  }'

# Expected Response: User successfully upgraded to Premium
```

### 7. Access Premium Content Successfully
```bash
curl -X GET http://localhost:3000/content/premium \
  -b "token=YOUR_COOKIE_HERE"

# Expected Response (200 OK):
# {
#   "success": true,
#   "message": "Welcome to Premium Content!",
#   "data": { ... }
# }
```

### 8. Admin Retrieves Analytics / Monthly Usage Report (CSV)
```bash
curl -X GET http://localhost:3000/admin/reports/monthly \
  -b "adminToken=YOUR_ADMIN_COOKIE" \
  -o report.csv
```

## System Architecture

- `routes/`: API endpoint definitions
- `controllers/`: Logic for routes
- `middleware/`: Auth validation, Request validation, Error Handling
- `models/`: Sequelize schemas defining Postgres mapping
- `services/`: Cron jobs and shared aggregated methods