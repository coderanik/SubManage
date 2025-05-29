# Subscription Management Backend

A robust subscription management system built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Subscription plan management
- Subscription lifecycle management (create, update, cancel)
- Automatic subscription expiration handling
- Subscription statistics and history
- Input validation and error handling
- CORS support
- Secure cookie handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd subscription-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

## API Documentation

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Subscription Endpoints

- `POST /subscriptions` - Create a new subscription
  - Body: `{ userId: string, planId: string }`

- `GET /subscriptions/:userId` - Get user's current subscription
  - Params: `userId`

- `PUT /subscriptions/:userId` - Update subscription
  - Params: `userId`
  - Body: `{ planId?: string, autoRenew?: boolean }`

- `DELETE /subscriptions/:userId` - Cancel subscription
  - Params: `userId`

- `GET /subscriptions/:userId/history` - Get subscription history
  - Params: `userId`

- `GET /subscriptions/stats` - Get subscription statistics

### Plan Endpoints

- `GET /subscriptions/plans` - Get all available plans

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "error",
  "message": "Error message"
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- HTTP-only cookies
- CORS configuration
- Input validation
- Error handling middleware

## Subscription Status

Subscriptions can have the following statuses:
- ACTIVE: Currently active subscription
- INACTIVE: Subscription is not active
- CANCELLED: User has cancelled the subscription
- EXPIRED: Subscription has expired

## Development

To run the server in development mode:
```bash
npm run dev
```

## Testing

To run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 