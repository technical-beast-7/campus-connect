// Authentication token utilities
import { getFromStorage, setToStorage, removeFromStorage } from './helpers';
import type { User } from '../types';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

// Token storage utilities
export const tokenStorage = {
  get: (): string | null => {
    return getFromStorage<string>(AUTH_TOKEN_KEY);
  },

  set: (token: string): void => {
    setToStorage(AUTH_TOKEN_KEY, token);
  },

  remove: (): void => {
    removeFromStorage(AUTH_TOKEN_KEY);
  },

  exists: (): boolean => {
    return !!tokenStorage.get();
  }
};

// User data storage utilities
export const userStorage = {
  get: (): User | null => {
    return getFromStorage<User>(USER_DATA_KEY);
  },

  set: (user: User): void => {
    setToStorage(USER_DATA_KEY, user);
  },

  remove: (): void => {
    removeFromStorage(USER_DATA_KEY);
  }
};

// Session utilities
export const sessionUtils = {
  // Save both token and user data
  saveSession: (token: string, user: User): void => {
    tokenStorage.set(token);
    userStorage.set(user);
  },

  // Clear all session data
  clearSession: (): void => {
    tokenStorage.remove();
    userStorage.remove();
  },

  // Check if session exists
  hasValidSession: (): boolean => {
    return tokenStorage.exists() && !!userStorage.get();
  },

  // Get stored session data
  getStoredSession: (): { token: string; user: User } | null => {
    const token = tokenStorage.get();
    const user = userStorage.get();
    
    if (token && user) {
      return { token, user };
    }
    
    return null;
  }
};

// JWT token utilities (for future use when backend is ready)
export const jwtUtils = {
  // Decode JWT payload (without verification - for client-side use only)
  decode: (token: string): any => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  },

  // Check if token is expired
  isExpired: (token: string): boolean => {
    try {
      const payload = jwtUtils.decode(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Get token expiration time
  getExpirationTime: (token: string): Date | null => {
    try {
      const payload = jwtUtils.decode(token);
      if (!payload || !payload.exp) return null;
      
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }
};