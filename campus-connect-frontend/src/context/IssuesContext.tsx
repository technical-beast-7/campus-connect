import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Issue, IssuesState, IssueFilters, IssueStatus, CreateIssueData } from '../types';
import { 
  generateMockIssues, 
  filterIssues, 
  sortIssues, 
  getUserIssues, 
  createMockIssue, 
  updateMockIssueStatus, 
  addMockComment 
} from '../utils/mockData';

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

  const fetchIssues = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockIssues = generateMockIssues(25);
      dispatch({ type: 'FETCH_ISSUES_SUCCESS', payload: mockIssues });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to fetch issues' });
    }
  };

  const fetchMyIssues = async (userId: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 600));
      const allIssues = generateMockIssues(25);
      const userIssues = getUserIssues(allIssues, userId);
      dispatch({ type: 'FETCH_MY_ISSUES_SUCCESS', payload: userIssues });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to fetch my issues' });
    }
  };

  const createIssue = async (issueData: CreateIssueData) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For mock purposes, use a default user ID
      const mockUserId = '1';
      const newIssue = createMockIssue(issueData, mockUserId);
      
      dispatch({ type: 'CREATE_ISSUE_SUCCESS', payload: newIssue });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to create issue' });
    }
  };

  const updateIssueStatus = async (issueId: string, status: IssueStatus) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Find the issue in current state
      const issue = state.issues.find(i => i.id === issueId) || state.myIssues.find(i => i.id === issueId);
      if (!issue) {
        throw new Error('Issue not found');
      }
      
      const updatedIssue = updateMockIssueStatus(issue, status);
      dispatch({ type: 'UPDATE_ISSUE_SUCCESS', payload: updatedIssue });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to update issue status' });
    }
  };

  const addComment = async (issueId: string, comment: string) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For mock purposes, use a default authority user ID
      const mockAuthorId = '4';
      const newComment = addMockComment(issueId, comment, mockAuthorId);
      
      dispatch({ 
        type: 'ADD_COMMENT_SUCCESS', 
        payload: { issueId, comment: newComment } 
      });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to add comment' });
    }
  };

  const setFilters = (filters: Partial<IssueFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getFilteredIssues = (): Issue[] => {
    const issues = state.issues;
    const filteredIssues = filterIssues(issues, state.filters);
    return sortIssues(filteredIssues, 'date', 'desc');
  };

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