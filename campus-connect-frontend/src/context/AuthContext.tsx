import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User, AuthState, RegisterData } from '../types';
import { sessionUtils, tokenStorage } from '../utils/auth';

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
  const initializeAuth = () => {
    const storedSession = sessionUtils.getStoredSession();
    if (storedSession) {
      dispatch({ type: 'INITIALIZE_AUTH', payload: storedSession.user });
    }
  };

  // Initialize auth on component mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await authApi.login(email, password);
      
      // Mock implementation for development
      console.log('Login attempt:', { email, password });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: email.includes('authority') ? 'authority' : 'student',
        department: 'Computer Science',
        createdAt: new Date(),
      };

      // Save session data
      sessionUtils.saveSession(mockToken, mockUser);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: mockUser, token: mockToken } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await authApi.register(userData);
      
      // Mock implementation for development
      console.log('Register attempt:', userData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        createdAt: new Date(),
      };

      // Save session data
      sessionUtils.saveSession(mockToken, mockUser);
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { user: mockUser, token: mockToken } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE_START' });
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await authApi.updateProfile(userData);
      
      // Mock implementation for development
      console.log('Update profile attempt:', userData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current user and merge with updates
      const currentUser = state.user;
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      const updatedUser: User = {
        ...currentUser,
        ...userData,
        // Ensure we don't overwrite critical fields accidentally
        id: currentUser.id,
        createdAt: currentUser.createdAt,
      };

      // Update session data
      const currentToken = tokenStorage.get();
      if (currentToken) {
        sessionUtils.saveSession(currentToken, updatedUser);
      }
      
      dispatch({ 
        type: 'UPDATE_PROFILE_SUCCESS', 
        payload: updatedUser 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      dispatch({ type: 'UPDATE_PROFILE_FAILURE', payload: errorMessage });
      throw error; // Re-throw to allow component to handle it
    }
  };

  const logout = () => {
    // Clear stored session data
    sessionUtils.clearSession();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

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