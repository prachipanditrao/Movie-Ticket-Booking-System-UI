
import type { User, AuthToken, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://movie-ticket-booking-system-b2uj.onrender.com";
const TOKEN_KEY = 'cineBookerAuthToken';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string; 
  password: string;
}

export async function loginUser(credentials: LoginPayload): Promise<AuthToken> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  } catch (error: any) {
    console.error(`Network error during login to ${API_BASE_URL}/auth/login:`, error);
    let hostname = API_BASE_URL;
    try {
      hostname = new URL(API_BASE_URL).hostname;
    } catch (e) { /* ignore, use full API_BASE_URL as hostname */ }
    if (error.message === "Failed to fetch") {
      throw new Error(
        `Unable to connect to the authentication server at ${hostname}. Please check your internet connection and try again. If the problem persists, the server may be unavailable.`
      );
    }
    throw new Error(`An unexpected network error occurred during login: ${error.message}`);
  }

  if (!response.ok) {
    let errorMessage = `Authentication failed. HTTP status: ${response.status}`;
    if (response.statusText) {
      errorMessage += ` - ${response.statusText}`;
    }

    try {
      const errorData: any = await response.json();
      if (errorData && typeof errorData.message === 'string' && errorData.message.trim() !== '') {
        errorMessage = errorData.message; // Override with more specific API message
      }
    } catch (jsonError) {
      // The API's error response was not JSON or parsing failed.
      // The errorMessage already contains status and statusText.
      console.warn(`Login error response from ${API_BASE_URL}/auth/login was not valid JSON or did not contain a 'message' field. Status: ${response.status}. Falling back to default error message.`);
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  if (!data.token) {
    throw new Error('Login successful but no token received.');
  }
  const authToken: AuthToken = { token: data.token, user: data.user }; 
  setToken(authToken.token);
  
  if (authToken.user) {
    localStorage.setItem('cineBookerUser', JSON.stringify(authToken.user));
  } else {
    try {
      const decoded = JSON.parse(atob(authToken.token.split('.')[1]));
      const userFromToken: User = { 
        id: decoded.sub || decoded.id || 'unknown', 
        username: decoded.username || 'User', 
        email: decoded.email || '' 
      };
      localStorage.setItem('cineBookerUser', JSON.stringify(userFromToken));
      authToken.user = userFromToken; 
    } catch (e) {
      console.warn("Could not decode token to get user info, or token structure unexpected.");
      const fallbackUser: User = {id: 'unknown', username: 'User', email: ''};
      localStorage.setItem('cineBookerUser', JSON.stringify(fallbackUser));
      authToken.user = fallbackUser;
    }
  }
  return authToken;
}

export async function registerUser(userData: RegisterPayload): Promise<User> { 
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  } catch (error: any) {
    console.error(`Network error during registration to ${API_BASE_URL}/auth/register:`, error);
    let hostname = API_BASE_URL;
    try {
      hostname = new URL(API_BASE_URL).hostname;
    } catch (e) { /* ignore, use full API_BASE_URL as hostname */ }
    if (error.message === "Failed to fetch") {
      throw new Error(
        `Unable to connect to the registration server at ${hostname}. Please check your internet connection and try again. If the problem persists, the server may be unavailable.`
      );
    }
    throw new Error(`An unexpected network error occurred during registration: ${error.message}`);
  }

  if (!response.ok) {
    let errorMessage = `Registration failed. HTTP status: ${response.status}`;
    if (response.statusText) {
      errorMessage += ` - ${response.statusText}`;
    }
    
    try {
      const errorData: any = await response.json();
      if (errorData && typeof errorData.message === 'string' && errorData.message.trim() !== '') {
        errorMessage = errorData.message; // Override with more specific API message
      }
    } catch (jsonError) {
      // The API's error response was not JSON or parsing failed.
      // The errorMessage already contains status and statusText.
      console.warn(`Registration error response from ${API_BASE_URL}/auth/register was not valid JSON or did not contain a 'message' field. Status: ${response.status}. Falling back to default error message.`);
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<User>;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('cineBookerUser'); 
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('cineBookerUser');
  if (userStr) {
    try {
      return JSON.parse(userStr) as User;
    } catch (e) {
      console.error("Failed to parse stored user data:", e);
      return null;
    }
  }
  return null;
}

export function logoutUser(): void {
  removeToken();
}

