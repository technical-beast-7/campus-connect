import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, IssuesProvider } from './mocks'
import type { User, Issue, Comment } from '../types'

// Mock user data
export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'student',
  department: 'Computer Science',
  createdAt: new Date('2024-01-01')
}

export const mockAuthorityUser: User = {
  id: 'auth-1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'authority',
  department: 'Administration',
  createdAt: new Date('2024-01-01')
}

// Mock issue data
export const mockComment: Comment = {
  id: 'comment-1',
  issueId: 'issue-1',
  authorId: 'auth-1',
  authorName: 'Jane Smith',
  authorRole: 'authority',
  content: 'We are looking into this issue.',
  createdAt: new Date('2024-01-02')
}

export const mockIssue: Issue = {
  id: 'issue-1',
  title: 'Broken projector in Room 101',
  description: 'The projector in classroom 101 is not working properly. It keeps flickering and the image is very dim.',
  category: 'classroom',
  status: 'pending',
  reporterId: 'user-1',
  reporterName: 'John Doe',
  reporterDepartment: 'Computer Science',
  imageUrl: 'https://example.com/image.jpg',
  comments: [mockComment],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02')
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: User | null
  initialIssues?: Issue[]
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialUser = mockUser,
    initialIssues = [mockIssue],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <AuthProvider initialUser={initialUser}>
          <IssuesProvider initialIssues={initialIssues}>
            {children}
          </IssuesProvider>
        </AuthProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'