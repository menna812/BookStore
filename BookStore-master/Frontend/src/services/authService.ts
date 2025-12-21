import axios from "axios";
import { User } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface AuthResponse {
  token: string;
  role: "customer" | "admin";
  userId: number;
  user?: any;
}

export interface LoginData {
  email: string;
  password: string;
}

// Helper function to get token
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to get stored user
const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const authService = {
  /**
   * Customer login
   */
  login: async (
    emailOrData: string | LoginData,
    password?: string
  ): Promise<AuthResponse> => {
    try {
      const data: LoginData =
        typeof emailOrData === "string"
          ? { email: emailOrData, password: password! }
          : emailOrData;
      const res = await axios.post(`${API_URL}/auth/login`, data);

      // Store token
      localStorage.setItem("token", res.data.token);

      // Try to fetch canonical user profile from server immediately so UI shows exact name
      try {
        const meRes = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        const me = meRes.data;
        const userData: User = {
          id:
            me.customer_id ||
            me.admin_id ||
            res.data.userId ||
            res.data.user?.id,
          email: me.email || data.email,
          fullName:
            me.fullName || `${me.firstname || ""} ${me.lastname || ""}`.trim(),
          role: res.data.role,
          firstname: me.firstname,
          lastname: me.lastname,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return { ...res.data, user: userData };
      } catch (e) {
        // Fallback to minimal stored info
        const userData: User = {
          id: res.data.userId || res.data.user?.id,
          email: data.email,
          fullName:
            res.data.user?.fullName ||
            `${res.data.user?.firstname || ""} ${
              res.data.user?.lastname || ""
            }`.trim(),
          role: res.data.role,
          firstname: res.data.user?.firstname,
          lastname: res.data.user?.lastname,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return { ...res.data, user: userData };
      }
    } catch (err: any) {
      if (err.response) {
        const message = err.response.data.message || "Login failed";
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

  /**
   * Admin login
   */
  adminLogin: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, data);

      // Store token
      localStorage.setItem("token", res.data.token);

      // Try to fetch canonical user profile from server immediately
      try {
        const meRes = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        const me = meRes.data;
        const userData: User = {
          id:
            me.customer_id ||
            me.admin_id ||
            res.data.userId ||
            res.data.user?.id,
          email: me.email || data.email,
          fullName:
            me.fullName || `${me.firstname || ""} ${me.lastname || ""}`.trim(),
          role: res.data.role,
          firstname: me.firstname,
          lastname: me.lastname,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return { ...res.data, user: userData };
      } catch (e) {
        const userData: User = {
          id: res.data.userId || res.data.user?.id,
          email: data.email,
          fullName:
            res.data.user?.fullName ||
            `${res.data.user?.firstname || ""} ${
              res.data.user?.lastname || ""
            }`.trim(),
          role: res.data.role,
          firstname: res.data.user?.firstname,
          lastname: res.data.user?.lastname,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return { ...res.data, user: userData };
      }
    } catch (err: any) {
      if (err.response) {
        const message = err.response.data.message || "Admin login failed";
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

  /**
   * Logout
   */
  logout: async (token?: string): Promise<{ message: string }> => {
    try {
      const authToken = token || localStorage.getItem("token") || "";
      const res = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Clear stored data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return res.data;
    } catch (err: any) {
      // Clear stored data even if logout fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");

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

  /**
   * Get current user from localStorage
   */
  getCurrentUser: async (): Promise<User | null> => {
    const token = getToken();
    if (!token) return null;

    // Prefer canonical server-side profile so we always have up-to-date names
    try {
      const meRes = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = meRes.data;
      const userData: User = {
        id: me.customer_id || me.admin_id || undefined,
        email: me.email,
        fullName:
          me.fullName || `${me.firstname || ""} ${me.lastname || ""}`.trim(),
        role: undefined as any, // role is not returned here; caller may rely on stored value
        firstname: me.firstname,
        lastname: me.lastname,
      };
      // Merge role from stored user if available
      const stored = getStoredUser();
      if (stored && stored.role) userData.role = stored.role;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      // Fallback to stored user
      return getStoredUser();
    }
  },

  /**
   * Signup
   */
  signup: async (
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const [firstname, ...lastnameParts] = fullName.split(" ");
      const lastname = lastnameParts.join(" ");

      const res = await axios.post(`${API_URL}/auth/register`, {
        firstname,
        lastname,
        email,
        password,
      });

      // Store token
      localStorage.setItem("token", res.data.token);

      // Store user data
      const userData: User = {
        id: res.data.userId || res.data.user?.id,
        email: email,
        fullName: fullName,
        role: res.data.role,
        firstname: firstname,
        lastname: lastname,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      return { ...res.data, user: userData };
    } catch (err: any) {
      if (err.response) {
        const message = err.response.data.message || "Signup failed";
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
