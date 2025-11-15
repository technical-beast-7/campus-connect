import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Issue, IssuesState, IssueFilters, IssueStatus, CreateIssueData } from '@/types';
import issueService from '@services/issueService';

interface IssuesContextType {
  state: IssuesState;
  fetchIssues: () => Promise<void>;
  fetchMyIssues: (userId: string) => Promise<void>;
  createIssue: (issueData: CreateIssueData) => Promise<void>;
  updateIssueStatus: (issueId: string, status: IssueStatus) => Promise<void>;
  addComment: (issueId: string, comment: string) => Promise<void>;
  setFilters: (filters: Partial<IssueFilters>) => void;
  clearError: () => void;
  getFilteredIssues: () => Issue[];
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

type IssuesAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_ISSUES_SUCCESS'; payload: Issue[] }
  | { type: 'FETCH_MY_ISSUES_SUCCESS'; payload: Issue[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'CREATE_ISSUE_SUCCESS'; payload: Issue }
  | { type: 'UPDATE_ISSUE_SUCCESS'; payload: Issue }
  | { type: 'ADD_COMMENT_SUCCESS'; payload: { issueId: string; comment: any } }
  | { type: 'SET_FILTERS'; payload: Partial<IssueFilters> }
  | { type: 'CLEAR_ERROR' };

const initialState: IssuesState = {
  issues: [],
  myIssues: [],
  isLoading: false,
  error: null,
  filters: {
    category: undefined,
    status: undefined,
    department: undefined,
    search: undefined,
  },
};

const issuesReducer = (state: IssuesState, action: IssuesAction): IssuesState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_ISSUES_SUCCESS':
      return { ...state, issues: action.payload, isLoading: false };
    case 'FETCH_MY_ISSUES_SUCCESS':
      return { ...state, myIssues: action.payload, isLoading: false };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'CREATE_ISSUE_SUCCESS':
      return {
        ...state,
        issues: [action.payload, ...state.issues],
        myIssues: [action.payload, ...state.myIssues],
        isLoading: false,
      };
    case 'UPDATE_ISSUE_SUCCESS':
      return {
        ...state,
        issues: state.issues.map(issue =>
          issue.id === action.payload.id ? action.payload : issue
        ),
        myIssues: state.myIssues.map(issue =>
          issue.id === action.payload.id ? action.payload : issue
        ),
        isLoading: false,
      };
    case 'ADD_COMMENT_SUCCESS':
      return {
        ...state,
        issues: state.issues.map(issue =>
          issue.id === action.payload.issueId
            ? { ...issue, comments: [...issue.comments, action.payload.comment] }
            : issue
        ),
        myIssues: state.myIssues.map(issue =>
          issue.id === action.payload.issueId
            ? { ...issue, comments: [...issue.comments, action.payload.comment] }
            : issue
        ),
        isLoading: false,
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const IssuesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(issuesReducer, initialState);

  const fetchIssues = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      console.log('Fetching all issues...');
      // Fetch issues from real API
      const issues = await issueService.getIssues();
      console.log('Received issues:', issues);
      
      // Handle empty array
      if (!issues || issues.length === 0) {
        console.log('No issues found, returning empty array');
        dispatch({ type: 'FETCH_ISSUES_SUCCESS', payload: [] });
        return;
      }
      
      // Transform API response to match frontend Issue type
      const transformedIssues = issues.map(issue => {
        console.log(`Issue ${issue._id} has ${issue.comments?.length || 0} comments from API`);
        if (issue.comments && issue.comments.length > 0) {
          console.log('Comment details:', JSON.stringify(issue.comments, null, 2));
        }
        return {
          id: issue._id,
          title: issue.title,
          description: issue.description,
          category: issue.category,
          status: issue.status,
          reporterId: issue.reporter._id,
          reporterName: issue.reporter.name,
          reporterDepartment: issue.department || issue.reporter.email,
          imageUrl: issue.imageUrl,
          comments: (issue.comments || []).map(c => ({
            id: c._id,
            issueId: issue._id,
            authorId: c.user._id,
            authorName: c.user.name,
            authorRole: c.user.role,
            content: c.text,
            createdAt: new Date(c.createdAt)
          })),
          createdAt: new Date(issue.createdAt),
          updatedAt: new Date(issue.updatedAt),
        };
      });
      dispatch({ type: 'FETCH_ISSUES_SUCCESS', payload: transformedIssues });
    } catch (error: any) {
      console.error('Error fetching issues:', error);
      // Still dispatch empty array so dashboard can load even on error
      dispatch({ type: 'FETCH_ISSUES_SUCCESS', payload: [] });
    }
  }, []);

  const fetchMyIssues = useCallback(async (userId: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      console.log('Fetching my issues for user:', userId);
      // Fetch user's issues from real API
      const issues = await issueService.getMyIssues();
      console.log('Received issues:', issues);
      
      // Handle empty array
      if (!issues || issues.length === 0) {
        console.log('No issues found, returning empty array');
        dispatch({ type: 'FETCH_MY_ISSUES_SUCCESS', payload: [] });
        return;
      }
      
      // Transform API response to match frontend Issue type
      const transformedIssues = issues.map(issue => ({
        id: issue._id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        status: issue.status,
        reporterId: issue.reporter._id,
        reporterName: issue.reporter.name,
        reporterDepartment: issue.department || issue.reporter.email,
        imageUrl: issue.imageUrl,
        comments: (issue.comments || []).map(c => ({
          id: c._id,
          issueId: issue._id,
          authorId: c.user._id,
          authorName: c.user.name,
          authorRole: c.user.role,
          content: c.text,
          createdAt: new Date(c.createdAt)
        })),
        createdAt: new Date(issue.createdAt),
        updatedAt: new Date(issue.updatedAt),
      }));
      dispatch({ type: 'FETCH_MY_ISSUES_SUCCESS', payload: transformedIssues });
    } catch (error: any) {
      console.error('Error fetching my issues:', error);
      // Still dispatch empty array so dashboard can load even on error
      dispatch({ type: 'FETCH_MY_ISSUES_SUCCESS', payload: [] });
    }
  }, []);

  const createIssue = useCallback(async (issueData: CreateIssueData) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Create issue via real API
      const newIssue = await issueService.createIssue({
        title: issueData.title,
        description: issueData.description,
        category: issueData.category,
        department: issueData.department,
        image: issueData.imageFile,
      });
      
      // Transform API response
      const transformedIssue = {
        id: newIssue._id,
        title: newIssue.title,
        description: newIssue.description,
        category: newIssue.category,
        status: newIssue.status,
        reporterId: newIssue.reporter._id,
        reporterName: newIssue.reporter.name,
        reporterDepartment: newIssue.department || newIssue.reporter.email,
        imageUrl: newIssue.imageUrl,
        comments: (newIssue.comments || []).map(c => ({
          id: c._id,
          issueId: newIssue._id,
          authorId: c.user._id,
          authorName: c.user.name,
          authorRole: c.user.role,
          content: c.text,
          createdAt: new Date(c.createdAt)
        })),
        createdAt: new Date(newIssue.createdAt),
        updatedAt: new Date(newIssue.updatedAt),
      };
      
      dispatch({ type: 'CREATE_ISSUE_SUCCESS', payload: transformedIssue });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create issue';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const updateIssueStatus = useCallback(async (issueId: string, status: IssueStatus) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Update issue status via real API
      const updatedIssue = await issueService.updateIssueStatus(issueId, { status });
      
      // Transform API response
      const transformedIssue = {
        id: updatedIssue._id,
        title: updatedIssue.title,
        description: updatedIssue.description,
        category: updatedIssue.category,
        status: updatedIssue.status,
        reporterId: updatedIssue.reporter._id,
        reporterName: updatedIssue.reporter.name,
        reporterDepartment: updatedIssue.department || updatedIssue.reporter.email,
        imageUrl: updatedIssue.imageUrl,
        comments: (updatedIssue.comments || []).map(c => ({
          id: c._id,
          issueId: updatedIssue._id,
          authorId: c.user._id,
          authorName: c.user.name,
          authorRole: c.user.role,
          content: c.text,
          createdAt: new Date(c.createdAt)
        })),
        createdAt: new Date(updatedIssue.createdAt),
        updatedAt: new Date(updatedIssue.updatedAt),
      };
      
      dispatch({ type: 'UPDATE_ISSUE_SUCCESS', payload: transformedIssue });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update issue status';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const addComment = useCallback(async (issueId: string, comment: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Call the comment API - returns the updated issue
      const updatedIssue = await issueService.addComment(issueId, comment);
      
      // Transform the backend issue to match our frontend Issue type
      const transformedIssue: Issue = {
        id: updatedIssue._id,
        title: updatedIssue.title,
        description: updatedIssue.description,
        category: updatedIssue.category,
        status: updatedIssue.status,
        reporterId: updatedIssue.reporter._id,
        reporterName: updatedIssue.reporter.name,
        reporterDepartment: updatedIssue.reporter.department || '',
        imageUrl: updatedIssue.imageUrl,
        comments: (updatedIssue.comments || []).map(c => ({
          id: c._id,
          issueId: updatedIssue._id,
          authorId: c.user._id,
          authorName: c.user.name,
          authorRole: c.user.role,
          content: c.text,
          createdAt: new Date(c.createdAt)
        })),
        createdAt: new Date(updatedIssue.createdAt),
        updatedAt: new Date(updatedIssue.updatedAt)
      };
      
      // Dispatch success with the updated issue
      dispatch({ 
        type: 'UPDATE_ISSUE_SUCCESS', 
        payload: transformedIssue
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add comment';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  const setFilters = useCallback((filters: Partial<IssueFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const getFilteredIssues = useCallback((): Issue[] => {
    let filtered = [...state.issues];

    // Apply filters
    if (state.filters.category) {
      filtered = filtered.filter(issue => issue.category === state.filters.category);
    }
    if (state.filters.status) {
      filtered = filtered.filter(issue => issue.status === state.filters.status);
    }
    if (state.filters.department) {
      filtered = filtered.filter(issue => issue.reporterDepartment === state.filters.department);
    }
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchLower) ||
        issue.description.toLowerCase().includes(searchLower) ||
        issue.reporterName.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [state.issues, state.filters]);

  return (
    <IssuesContext.Provider
      value={{
        state,
        fetchIssues,
        fetchMyIssues,
        createIssue,
        updateIssueStatus,
        addComment,
        setFilters,
        clearError,
        getFilteredIssues,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssuesContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
};
