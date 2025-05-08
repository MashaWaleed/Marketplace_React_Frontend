export interface User {
  name: string;
  email: string;
}

export interface Product {
  id?: string;
  product_id?: number;
  name: string;
  price: number;
  picture_url: string;
  description: string;
  seller_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Wallet {
  balance: number;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  credit: number;
  debit: number;
  done: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

export interface AnalyticsData {
  total_products: number;
  total_selling_products: number;
  total_purchased_products: number;
}

export interface AddMoneyResponse {
  payment_url: string;
}

export interface ExternalTokenResponse {
  token: string;
} 