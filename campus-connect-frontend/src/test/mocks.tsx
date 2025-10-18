import React from 'react'
import { vi } from 'vitest'
import type { User, Issue, AuthState, IssuesState } from '../types'

// Mock AuthContext
export const mockAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

export const mockAuthContextValue = {
  state: mockAuthState,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn()
}

export const AuthProvider: React.FC<{ children: React.ReactNode; initialUser?: User | null }> = ({ 
  children, 
  initialUser = null 
}) => {
  const contextValue = {
    ...mockAuthContextValue,
    state: {
      ...mockAuthState,
      user: initialUser,
      isAuthenticated: !!initialUser,
      isLoading: false
    }
  }
  
  return (
    <div data-testid="auth-provider">
      {children}
    </div>
  )
}

// Mock IssuesContext
export const mockIssuesState: IssuesState = {
  issues: [],
  myIssues: [],
  isLoading: false,
  error: null,
  filters: {}
}

export const mockIssuesContextValue = {
  state: mockIssuesState,
  fetchIssues: vi.fn(),
  fetchMyIssues: vi.fn(),
  createIssue: vi.fn(),
  updateIssueStatus: vi.fn(),
  addComment: vi.fn(),
  setFilters: vi.fn()
}

export const IssuesProvider: React.FC<{ children: React.ReactNode; initialIssues?: Issue[] }> = ({ 
  children, 
  initialIssues = [] 
}) => {
  return (
    <div data-testid="issues-provider">
      {children}
    </div>
  )
}