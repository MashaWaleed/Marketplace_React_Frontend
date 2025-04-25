# Marketplace Frontend

A modern React frontend for the distributed online marketplace system. This frontend application provides a user-friendly interface for buying and selling items, managing inventory, and handling transactions.

## Features

- User authentication (signup/login)
- Product browsing and search
- Product management (add/edit/remove)
- E-wallet integration
- Transaction history
- Responsive design
- Modern UI with Chakra UI

## Tech Stack

- React 18
- TypeScript
- Vite
- Chakra UI
- React Query
- React Router
- Zustand
- React Hook Form
- Yup

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd marketplace-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Detailed Project Structure

```
src/
  ├── components/          # Reusable UI components
  │   ├── Navigation.tsx   # Main navigation component
  │   ├── ProductCard.tsx  # Product display card
  │   └── ...             # Other reusable components
  │
  ├── pages/              # Page components
  │   ├── Home.tsx        # Landing page with product listing
  │   ├── Login.tsx       # User login
  │   ├── Signup.tsx      # User registration
  │   ├── Profile.tsx     # User profile and analytics
  │   ├── Wallet.tsx      # E-wallet management
  │   └── ...            # Other page components
  │
  ├── services/           # API services
  │   ├── api.ts         # API client configuration
  │   ├── auth.ts        # Authentication service
  │   ├── products.ts    # Product-related API calls
  │   └── wallet.ts      # Wallet-related API calls
  │
  ├── store/             # State management (Zustand)
  │   └── auth.ts        # Authentication state
  │
  ├── types/             # TypeScript type definitions
  │   ├── api.ts         # API response types
  │   └── common.ts      # Shared type definitions
  │
  └── App.tsx            # Main application component
```

## API Integration Guide

This guide provides detailed information about the API endpoints that the frontend expects to interact with. Backend developers should implement these endpoints according to the specifications below.

### Base URL Configuration

The frontend expects the API to be available at the URL specified in the `VITE_API_BASE_URL` environment variable. By default, it's set to `http://localhost:3000`.

### Authentication

All authenticated endpoints expect a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Endpoints

1. **Login**
   - Endpoint: `POST /account/login`
   - Request Body:
     ```typescript
     {
       email: string;
       password: string;
     }
     ```
   - Response:
     ```typescript
     {
       data: {
         token: string;
         user: {
           id: string;
           name: string;
           email: string;
         }
       }
     }
     ```

2. **Signup**
   - Endpoint: `POST /account/signup`
   - Request Body:
     ```typescript
     {
       name: string;
       email: string;
       password: string;
     }
     ```
   - Response: Same as login

3. **Verify Token**
   - Endpoint: `POST /auth/verify-token`
   - Request Body:
     ```typescript
     {
       token: string;
     }
     ```
   - Response:
     ```typescript
     {
       data: {
         valid: boolean;
       }
     }
     ```

### Products

1. **List Products**
   - Endpoint: `GET /products`
   - Query Parameters:
     - `q`: string (optional) - Search query
   - Response:
     ```typescript
     {
       data: Array<{
         id: string;
         name: string;
         description: string;
         price: number;
         picture_url: string;
         seller_id: string;
         created_at: string;
       }>
     }
     ```

2. **Get Product**
   - Endpoint: `GET /products/:id`
   - Response:
     ```typescript
     {
       data: {
         id: string;
         name: string;
         description: string;
         price: number;
         picture_url: string;
         seller_id: string;
         created_at: string;
       }
     }
     ```

3. **Create Product**
   - Endpoint: `POST /products/selling`
   - Request Body:
     ```typescript
     {
       name: string;
       description: string;
       price: number;
       picture_url: string;
     }
     ```
   - Response: Same as Get Product

4. **Update Product**
   - Endpoint: `PUT /products/:id`
   - Request Body: Same as Create Product
   - Response: Same as Get Product

5. **Delete Product**
   - Endpoint: `DELETE /products/:id`
   - Response:
     ```typescript
     {
       success: boolean;
     }
     ```

6. **Get Purchased Products**
   - Endpoint: `GET /products/purchased`
   - Response: Same as List Products

7. **Get Selling Products**
   - Endpoint: `GET /products/selling`
   - Response: Same as List Products

8. **Buy Product**
   - Endpoint: `POST /products/buy/:id`
   - Response:
     ```typescript
     {
       success: boolean;
     }
     ```

9. **Get Analytics**
   - Endpoint: `GET /products/analytics`
   - Response:
     ```typescript
     {
       data: {
         total_products: number;
         total_selling_products: number;
         total_purchased_products: number;
       }
     }
     ```

### Wallet

1. **Get Wallet**
   - Endpoint: `GET /e-wallet`
   - Response:
     ```typescript
     {
       data: {
         balance: number;
       }
     }
     ```

2. **Add Money**
   - Endpoint: `POST /e-wallet`
   - Request Body:
     ```typescript
     {
       amount: number;
     }
     ```
   - Response: Same as Get Wallet

3. **Get Transactions**
   - Endpoint: `GET /e-wallet/transactions`
   - Response:
     ```typescript
     {
       data: Array<{
         id: string;
         amount: number;
         date: string;
         credit: number;
         debit: number;
         done: boolean;
       }>
     }
     ```

### Error Handling

The API should return errors in the following format:
```typescript
{
  error: {
    message: string;
    code?: string;
  }
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### CORS Configuration

The backend should allow CORS requests from the frontend origin with the following headers:
- Access-Control-Allow-Origin: [frontend origin]
- Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
- Access-Control-Allow-Headers: Content-Type, Authorization
- Access-Control-Allow-Credentials: true

## Development

- Run tests: `npm test`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.

## Docker

This project includes Docker configuration for easy deployment. Follow these steps to run the application using Docker:

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Access the application at http://localhost

3. To stop the containers:
   ```bash
   docker-compose down
   ```

### Building the Docker Image Manually

1. Build the Docker image:
   ```bash
   docker build -t marketplace-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 80:80 marketplace-frontend
   ```

### Environment Variables

The application uses environment variables that can be configured in the `.env` file. When running with Docker, you can override these variables using the `environment` section in the `docker-compose.yml` file. 