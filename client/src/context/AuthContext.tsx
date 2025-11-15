import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { User, AuthState, RegisterData } from '@/types';
import { sessionUtils, tokenStorage } from '@utils/auth';

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INITIALIZE_AUTH'; payload: User }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'UPDATE_PROFILE_START' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'UPDATE_PROFILE_FAILURE'; payload: string };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'UPDATE_PROFILE_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      console.log('Reducer: Processing LOGIN_SUCCESS/REGISTER_SUCCESS', action.payload);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
    case 'UPDATE_PROFILE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'INITIALIZE_AUTH':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication from stored session on mount
  const initializeAuth = useCallback(() => {
    console.log('initializeAuth called');
    const storedSession = sessionUtils.getStoredSession();
    console.log('Stored session:', storedSession);
    if (storedSession) {
      console.log('Initializing auth with stored session');
      dispatch({ type: 'INITIALIZE_AUTH', payload: storedSession.user });
    } else {
      console.log('No stored session found');
    }
  }, []);

  // Initialize auth on component mount
  useEffect(() => {
    console.log('AuthProvider mounted, calling initializeAuth');
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (email: string, password: string) => {
    console.log('login() called with email:', email);
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('Calling backend API at http://localhost:5000/api/auth/login');
      // Call real backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Backend response:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        console.error('Login failed with response:', data);
        throw new Error(data.message || 'Login failed');
      }

      // Extract user and token from response
      const { token, ...userData} = data;
      const user: User = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        categories: userData.categories,
        avatar: userData.avatar,
        createdAt: new Date(userData.createdAt || Date.now()),
      };

      // Save session data
      sessionUtils.saveSession(token, user);
      
      console.log('Login successful, dispatching LOGIN_SUCCESS with user:', user);
      console.log('Token saved:', token);
      console.log('Token in localStorage:', localStorage.getItem('authToken'));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token } 
      });
    } catch (error) {
      console.error('Login error caught:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      // Note: Registration now uses OTP flow in RegisterPage
      // This function is kept for compatibility but may not be used
      // The actual registration happens via /api/auth/send-otp and /api/auth/verify-otp
      
      // Call real backend API (legacy endpoint without OTP)
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Extract user and token from response
      const { token, ...userDataResponse } = data;
      const user: User = {
        id: userDataResponse._id,
        name: userDataResponse.name,
        email: userDataResponse.email,
        role: userDataResponse.role,
        department: userDataResponse.department,
        avatar: userDataResponse.avatar,
        createdAt: new Date(userDataResponse.createdAt || Date.now()),
      };

      // Save session data
      sessionUtils.saveSession(token, user);
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { user, token } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE_START' });
    try {
      // Get current token
      const currentToken = tokenStorage.get();
      if (!currentToken) {
        throw new Error('No authentication token found');
      }

      // Call real backend API
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Extract updated user data
      const { token, ...userDataResponse } = data;
      const updatedUser: User = {
        id: userDataResponse._id,
        name: userDataResponse.name,
        email: userDataResponse.email,
        role: userDataResponse.role,
        department: userDataResponse.department,
        avatar: userDataResponse.avatar,
        createdAt: new Date(userDataResponse.createdAt || Date.now()),
      };

      // Update session data with new token if provided
      sessionUtils.saveSession(token || currentToken, updatedUser);
      
      dispatch({ 
        type: 'UPDATE_PROFILE_SUCCESS', 
        payload: updatedUser 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      dispatch({ type: 'UPDATE_PROFILE_FAILURE', payload: errorMessage });
      throw error; // Re-throw to allow component to handle it
    }
  }, []);

  const logout = useCallback(() => {
    // Clear stored session data
    sessionUtils.clearSession();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      state, 
      login, 
      register, 
      updateProfile,
      logout, 
      clearError, 
      initializeAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
