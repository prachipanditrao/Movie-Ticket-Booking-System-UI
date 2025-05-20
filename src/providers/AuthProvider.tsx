
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getToken as getStoredToken, 
  setToken as storeToken, 
  removeToken as deleteToken, 
  loginUser as apiLogin, 
  registerUser as apiRegister, 
  logoutUser as apiLogout, 
  getStoredUser,
  type LoginPayload, // Import the specific payload type
  type RegisterPayload // Import the specific payload type
} from '@/lib/auth';
import type { User, AuthToken } from '@/types';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>; // Use LoginPayload
  register: (userData: RegisterPayload) => Promise<void>; // Use RegisterPayload
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        setToken(storedToken);
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === '/login' || pathname === '/register';
      // If not authenticated (no token), not on an auth page, AND on the root page, redirect to login
      if (!token && !isAuthPage && pathname === '/') {
        router.push('/login');
      }
      // Optional: If authenticated and on an auth page, redirect to home (uncomment if desired)
      // else if (token && isAuthPage) {
      //   router.push('/');
      // }
    }
  }, [isLoading, token, pathname, router]);


  const login = useCallback(async (credentials: LoginPayload) => {
    setIsLoading(true);
    try {
      const authToken: AuthToken = await apiLogin(credentials);
      storeToken(authToken.token);
      setToken(authToken.token);
      // Ensure user state is updated from authToken.user or getStoredUser as a fallback
      setUser(authToken.user || getStoredUser()); 
      router.push('/'); 
    } catch (error) {
      console.error("Login failed:", error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: RegisterPayload) => {
    setIsLoading(true);
    try {
      await apiRegister(userData);
      router.push('/login');
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    apiLogout(); 
    setUser(null);
    setToken(null);
    router.push('/login'); 
  }, [router]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

