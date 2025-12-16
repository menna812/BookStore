// src/services/authService.ts
export interface AuthResponse {
  token: string;
  role: 'customer' | 'admin';
  userId: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  // add other fields according to your customerSchema
}

export interface LoginData {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  /**
   * Register a new customer
   */
  register: async (data: RegisterData): Promise<{ id: number; message: string }> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }

    return res.json();
  },

  /**
   * Customer login
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    return res.json();
  },

  /**
   * Admin login
   */
  adminLogin: async (data: LoginData): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Admin login failed');
    }

    return res.json();
  },

  /**
   * Logout
   */
  logout: async (token: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Logout failed');
    }

    return res.json();
  },
};
