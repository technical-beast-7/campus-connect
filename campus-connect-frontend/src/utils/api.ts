import { API_BASE_URL } from './constants';

// API utility functions
export class ApiError extends Error {
  public status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error or server unavailable');
  }
};

// Auth API functions (will be implemented with backend)
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: any) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Issues API functions (will be implemented with backend)
export const issuesApi = {
  getAll: async (filters?: any) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/issues?${params}`);
  },

  getMyIssues: async () => {
    return apiRequest('/issues/my');
  },

  create: async (issueData: any) => {
    return apiRequest('/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  },

  updateStatus: async (issueId: string, status: string) => {
    return apiRequest(`/issues/${issueId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  addComment: async (issueId: string, comment: string) => {
    return apiRequest(`/issues/${issueId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  },
};