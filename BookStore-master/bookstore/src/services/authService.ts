import type { User } from '../types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Fake delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return fake user
    const fakeUser: User = { id: '1', fullName: 'Test User', email };
    localStorage.setItem('token', 'fake-token');
    return fakeUser;
  },

  signup: async (fullName: string, email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fakeUser: User = { id: '2', fullName, email };
    localStorage.setItem('token', 'fake-token');
    return fakeUser;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const token = localStorage.getItem('token');
    if (!token) return null;

    return { id: '1', fullName: 'Test User', email: 'test@test.com' };
  },

  forgotPassword: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Fake password reset for ${email}`);
  },
};
