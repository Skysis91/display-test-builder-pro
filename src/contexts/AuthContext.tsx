
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

type User = {
  username: string;
  role: string;
};

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock admin user - in a real app, this would be verified against a server
  const ADMIN_USER = { username: 'admin', password: 'admin123', role: 'admin' };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('adtest_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      const userData = { username, role: ADMIN_USER.role };
      setUser(userData);
      localStorage.setItem('adtest_user', JSON.stringify(userData));
      toast.success('Login successful');
      setIsLoading(false);
      return true;
    } else {
      toast.error('Invalid username or password');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adtest_user');
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
