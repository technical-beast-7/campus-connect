import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'authority';
  department: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'authority';
  department: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  department?: string;
  avatar?: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * Get current user profile
 */
export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await api.put<User>('/auth/profile', data);
  return response.data;
};

/**
 * Logout user (client-side only)
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
};

export default authService;
