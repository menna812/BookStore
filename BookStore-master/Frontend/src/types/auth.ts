export interface User {
  id: string;
  fullName: string;
  email: string;
  role?: 'customer' | 'admin' | 'publisher';
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  field?: string;
}