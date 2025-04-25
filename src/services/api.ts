import { api } from './api.config';
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
    api.post<AuthResponse>('/account/login', credentials),
  
  signup: (credentials: SignupCredentials) => 
    api.post<AuthResponse>('/account/signup', credentials),
  
  verifyToken: (token: string) => 
    api.post<{ valid: boolean }>('/auth/verify-token', { token }),
};

export const productsAPI = {
  getProducts: (query?: string) => 
    api.get<{ data: Product[] }>('/products', { params: { q: query } }),
  
  getProduct: (id: string) => 
    api.get<{ data: Product }>(`/products/${id}`),
  
  createProduct: (product: Omit<Product, 'id'>) => 
    api.post<{ data: Product }>('/products/selling', product),
  
  updateProduct: (id: string, product: Product) => 
    api.put<{ data: Product }>(`/products/${id}`, product),
  
  deleteProduct: (id: string) => 
    api.delete<{ success: boolean }>(`/products/${id}`),
  
  getPurchasedProducts: () => 
    api.get<{ data: Product[] }>('/products/purchased'),
  
  getSellingProducts: () => 
    api.get<{ data: Product[] }>('/products/selling'),
  
  buyProduct: (id: string) => 
    api.post<{ success: boolean }>(`/products/buy/${id}`),
  
  getAnalytics: () => 
    api.get<{ 
      data: { 
        total_products: number;
        total_selling_products: number;
        total_purchased_products: number;
      } 
    }>('/products/analytics'),
};

export const walletAPI = {
  getWallet: () => 
    api.get<{ data: Wallet }>('/e-wallet'),
  
  addMoney: (amount: number) => 
    api.post<{ data: Wallet }>('/e-wallet', { amount }),
  
  getTransactions: () => 
    api.get<{ data: Transaction[] }>('/e-wallet/transactions'),
}; 