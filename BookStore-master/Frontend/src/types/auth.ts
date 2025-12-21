export interface User {
  id: string;
  fullName: string;
  email: string;
  role?: "customer" | "admin" | "publisher";
  createdAt?: string;
  firstname?: string;  // Add this
  lastname?: string; 
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  role: "customer" | "admin";
  userId: number;
  user?: User;
}

export interface AuthError {
  message: string;
  field?: string;
}
export interface LoginData {
  email: string;
  password: string;
}
