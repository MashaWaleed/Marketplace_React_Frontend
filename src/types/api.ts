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

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 