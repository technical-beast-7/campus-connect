import api from './api';

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  text: string;
  createdAt: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'canteen' | 'classroom' | 'hostel' | 'transport' | 'other';
  status: 'pending' | 'in-progress' | 'resolved';
  reporter: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  imageUrl?: string;
  department?: string;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  category: 'maintenance' | 'canteen' | 'classroom' | 'hostel' | 'transport' | 'other';
  department?: string;
  image?: File;
}

export interface UpdateIssueStatusData {
  status: 'pending' | 'in-progress' | 'resolved';
}

export interface IssueFilters {
  status?: string;
  category?: string;
  department?: string;
}

/**
 * Create a new issue
 */
export const createIssue = async (data: CreateIssueData): Promise<Issue> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('category', data.category);
  
  if (data.department) {
    formData.append('department', data.department);
  }
  
  if (data.image) {
    formData.append('image', data.image);
  }
  
  const response = await api.post<{ success: boolean; data: Issue }>('/issues', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

/**
 * Get all issues with optional filters
 */
export const getIssues = async (filters?: IssueFilters): Promise<Issue[]> => {
  const params = new URLSearchParams();
  
  if (filters?.status) {
    params.append('status', filters.status);
  }
  
  if (filters?.category) {
    params.append('category', filters.category);
  }
  
  if (filters?.department) {
    params.append('department', filters.department);
  }
  
  const response = await api.get<{ success: boolean; count: number; data: Issue[] }>('/issues', { params });
  return response.data.data;
};

/**
 * Get issues created by current user
 */
export const getMyIssues = async (): Promise<Issue[]> => {
  const response = await api.get<{ success: boolean; count: number; data: Issue[] }>('/issues/my-issues');
  return response.data.data;
};

/**
 * Get single issue by ID
 */
export const getIssueById = async (id: string): Promise<Issue> => {
  const response = await api.get<{ success: boolean; data: Issue }>(`/issues/${id}`);
  return response.data.data;
};

/**
 * Update issue status (authority only)
 */
export const updateIssueStatus = async (
  id: string,
  data: UpdateIssueStatusData
): Promise<Issue> => {
  const response = await api.put<{ success: boolean; data: Issue }>(`/issues/${id}/status`, data);
  return response.data.data;
};

/**
 * Delete issue (admin only)
 */
export const deleteIssue = async (id: string): Promise<void> => {
  await api.delete(`/issues/${id}`);
};

/**
 * Add comment to issue
 */
export const addComment = async (id: string, text: string): Promise<Issue> => {
  const response = await api.post<{ success: boolean; data: Issue }>(`/issues/${id}/comments`, { text });
  return response.data.data;
};

const issueService = {
  createIssue,
  getIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
  addComment,
};

export default issueService;
