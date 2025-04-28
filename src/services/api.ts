import axios from 'axios';
import type { LoginCredentials, SignupCredentials, Product, Wallet, Transaction, AuthResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone',
    price: 699.99,
    picture_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
    description: 'Latest smartphone with advanced features and high-performance camera.',
  },
  {
    id: '2',
    name: 'Laptop',
    price: 1299.99,
    picture_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    description: 'Powerful laptop for work and entertainment with long battery life.',
  },
  {
    id: '3',
    name: 'Headphones',
    price: 199.99,
    picture_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    description: 'Wireless noise-cancelling headphones with premium sound quality.',
  },
  {
    id: '4',
    name: 'Smartwatch',
    price: 299.99,
    picture_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=600&fit=crop',
    description: 'Feature-rich smartwatch with health tracking and notifications.',
  },
];

const mockWallet: Wallet = {
  balance: 1000.00,
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 500.00,
    date: '2023-04-01T10:00:00Z',
    credit: 500.00,
    debit: 0,
    done: true,
  },
  {
    id: '2',
    amount: 200.00,
    date: '2023-04-05T15:30:00Z',
    credit: 0,
    debit: 200.00,
    done: true,
  },
];

// Use mock data instead of making API calls
const useMockData = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: LoginCredentials) => 
    useMockData 
      ? Promise.resolve({ 
          data: { 
            token: 'mock-token-for-development', 
            user: { name: 'Test User', email: credentials.email } 
          } 
        })
      : api.post('/account/login', credentials),
  
  signup: (credentials: SignupCredentials) => 
    useMockData 
      ? Promise.resolve({ 
          data: { 
            token: 'mock-token-for-development', 
            user: { name: credentials.name, email: credentials.email } 
          } 
        })
      : api.post('/account/signup', credentials),
  
  verifyToken: (token: string) => 
    useMockData 
      ? Promise.resolve({ data: { valid: true } })
      : api.post('/auth/verify-token', { token }),
};

export const productsAPI = {
  getProducts: (query?: string) => 
    useMockData 
      ? Promise.resolve({ 
          data: query 
            ? mockProducts.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) || 
                p.description.toLowerCase().includes(query.toLowerCase())
              )
            : mockProducts 
        })
      : api.get('/products', { params: { q: query } }),
  
  getProduct: (id: string) => 
    useMockData 
      ? Promise.resolve({ 
          data: mockProducts.find(p => p.id === id) || mockProducts[0] 
        })
      : api.get(`/products/${id}`),
  
  createProduct: (product: Omit<Product, 'id'>) => 
    useMockData 
      ? Promise.resolve({ 
          data: { ...product, id: String(mockProducts.length + 1) } 
        })
      : api.post('/products/selling', product),
  
  updateProduct: (id: string, product: Product) => 
    useMockData 
      ? Promise.resolve({ data: product })
      : api.put(`/products/${id}`, product),
  
  deleteProduct: (id: string) => 
    useMockData 
      ? Promise.resolve({ data: { success: true } })
      : api.delete(`/products/${id}`),
  
  getPurchasedProducts: () => 
    useMockData 
      ? Promise.resolve({ data: mockProducts.slice(0, 2) })
      : api.get('/products/purchased'),
  
  getSellingProducts: () => 
    useMockData 
      ? Promise.resolve({ data: mockProducts.slice(2) })
      : api.get('/products/selling'),
  
  buyProduct: (id: string) => 
    useMockData 
      ? Promise.resolve({ data: { success: true } })
      : api.post(`/products/buy/${id}`),
  
  getAnalytics: () => 
    useMockData 
      ? Promise.resolve({ 
          data: { 
            total_products: mockProducts.length,
            total_selling_products: mockProducts.slice(2).length,
            total_purchased_products: mockProducts.slice(0, 2).length,
          } 
        })
      : api.get('/products/analytics'),
};

export const walletAPI = {
  getWallet: () => 
    useMockData 
      ? Promise.resolve({ data: mockWallet })
      : api.get('/e-wallet'),
  
  addMoney: (amount: number) => 
    useMockData 
      ? Promise.resolve({ 
          data: { 
            ...mockWallet, 
            balance: mockWallet.balance + amount 
          } 
        })
      : api.post('/e-wallet', { amount }),
  
  getTransactions: () => 
    useMockData 
      ? Promise.resolve({ data: mockTransactions })
      : api.get('/e-wallet/transactions'),
}; 