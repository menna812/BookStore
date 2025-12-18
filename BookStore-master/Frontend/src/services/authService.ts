import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface AuthResponse {
  token: string;
  role: "customer" | "admin";
  userId: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  /**
   * Customer login
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      return res.data;
    } catch (err: any) {
      if (err.response) {
        // Server responded with error
        const message = err.response.data.message || "Login failed";
        throw new Error(message);
      } else if (err.request) {
        // Request made but no response
        throw new Error(
          "Cannot connect to server. Please check your connection."
        );
      } else {
        // Something else happened
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  /**
   * Admin login
   */
  adminLogin: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, data);
      return res.data;
    } catch (err: any) {
      if (err.response) {
        // Server responded with error
        const message = err.response.data.message || "Admin login failed";
        throw new Error(message);
      } else if (err.request) {
        // Request made but no response
        throw new Error(
          "Cannot connect to server. Please check your connection."
        );
      } else {
        // Something else happened
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  /**
   * Logout
   */
  logout: async (token: string): Promise<{ message: string }> => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      if (err.response) {
        const message = err.response.data.message || "Logout failed";
        throw new Error(message);
      } else if (err.request) {
        throw new Error(
          "Cannot connect to server. Please check your connection."
        );
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },
};
