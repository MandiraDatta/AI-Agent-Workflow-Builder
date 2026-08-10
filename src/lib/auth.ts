export interface User {
  id: string;
  email: string;
  name: string;
}

const AUTH_KEY = 'mock_auth_user';

export const auth = {
  async login(email: string, password: string): Promise<User> {
    // Mock network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Accept any syntactically valid email/password combination
    if (!email || !password || !email.includes('@')) {
      throw new Error("Invalid credentials");
    }

    const user: User = {
      id: "mock-user-id",
      email,
      name: "Demo User"
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
    
    return user;
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(AUTH_KEY);
      if (userStr) {
        return JSON.parse(userStr) as User;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }
};
