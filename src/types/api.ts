export interface User {
  name: string;
  email: string;
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  picture_url: string;
  description: string;
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
  name: string;
  email: string;
}

export interface AnalyticsData {
  total_products: number;
  total_selling_products: number;
  total_purchased_products: number;
}

export interface AddMoneyResponse {
  session_id: string;
}

export interface ExternalTokenResponse {
  token: string;
} 