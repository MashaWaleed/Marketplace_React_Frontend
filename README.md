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

## Backend Integration Guide

### API Endpoints

The frontend expects the following API endpoints to be available:

#### Authentication
- `POST /account/login` - User login
  - Request: `{ email: string, password: string }`
  - Response: `{ token: string, user: User }`

- `POST /account/signup` - User registration
  - Request: `{ email: string, password: string, name: string }`
  - Response: `{ token: string, user: User }`

#### Products
- `GET /products` - List all products
  - Query params: `search?: string`
  - Response: `{ data: Product[] }`

- `GET /products/{id}` - Get product details
  - Response: `{ data: Product }`

- `POST /products` - Create new product
  - Request: `{ name: string, description: string, price: number, picture_url: string }`
  - Response: `{ data: Product }`

- `PUT /products/{id}` - Update product
  - Request: `{ name?: string, description?: string, price?: number, picture_url?: string }`
  - Response: `{ data: Product }`

- `DELETE /products/{id}` - Delete product
  - Response: `{ success: boolean }`

#### Wallet
- `GET /e-wallet` - Get wallet balance
  - Response: `{ data: { balance: number } }`

- `POST /e-wallet/add` - Add money to wallet
  - Request: `{ amount: number }`
  - Response: `{ data: { balance: number } }`

- `GET /e-wallet/transactions` - Get transaction history
  - Response: `{ data: Transaction[] }`

### Data Types

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
}
```

#### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  picture_url: string;
  seller_id: string;
  created_at: string;
}
```

#### Transaction
```typescript
interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed';
  created_at: string;
}
```

### Integration Steps

1. **API Base URL Configuration**
   - Set the `VITE_API_BASE_URL` environment variable to point to your backend server
   - Default: `http://localhost:3000`

2. **Authentication**
   - Implement JWT token-based authentication
   - Store the token in localStorage
   - Include the token in the Authorization header for all authenticated requests

3. **Error Handling**
   - The frontend expects error responses in the format:
     ```typescript
     {
       error: {
         message: string;
         code?: string;
       }
     }
     ```

4. **Image Handling**
   - Product images should be served as URLs
   - Recommended image size: 800x600 pixels
   - Supported formats: JPG, PNG, WebP

5. **CORS Configuration**
   - Enable CORS on your backend
   - Allow requests from the frontend origin
   - Allow necessary HTTP methods (GET, POST, PUT, DELETE)

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