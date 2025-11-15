// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'authority';
  department: string;
  categories?: string[];
  avatar?: string;
  createdAt: Date;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  reporterId: string;
  reporterName: string;
  reporterDepartment: string;
  imageUrl?: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export type IssueCategory = 'maintenance' | 'canteen' | 'classroom' | 'hostel' | 'transport' | 'other';
export type IssueStatus = 'pending' | 'in-progress' | 'resolved';

export interface Comment {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IssuesState {
  issues: Issue[];
  myIssues: Issue[];
  isLoading: boolean;
  error: string | null;
  filters: IssueFilters;
}

export interface IssueFilters {
  category?: IssueCategory;
  status?: IssueStatus;
  department?: string;
  search?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'authority';
  department: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  category: IssueCategory;
  imageFile?: File;
}

export interface ProfileData {
  name: string;
  email: string;
  department: string;
}
