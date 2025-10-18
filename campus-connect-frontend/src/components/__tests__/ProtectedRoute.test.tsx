import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, render } from '../../test/utils'
import { mockUser, mockAuthorityUser } from '../../test/utils'
import ProtectedRoute from '../ProtectedRoute'
import { BrowserRouter } from 'react-router-dom'

// Mock Navigate component
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
      mockNavigate(to, replace)
      return <div data-testid="navigate" data-to={to} data-replace={replace} />
    }
  }
})

// Mock AuthContext
const mockAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    state: mockAuthState
  })
}))

describe('ProtectedRoute', () => {
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('authentication states', () => {
    it('shows loading state when authentication is loading', () => {
      vi.mocked(mockAuthState).isLoading = true
      vi.mocked(mockAuthState).isAuthenticated = false
      vi.mocked(mockAuthState).user = null
      
      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('redirects to login when user is not authenticated', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = false
      vi.mocked(mockAuthState).user = null
      
      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      const navigateElement = screen.getByTestId('navigate')
      expect(navigateElement).toHaveAttribute('data-to', '/login')
      expect(navigateElement).toHaveAttribute('data-replace', 'true')
    })

    it('renders children when user is authenticated', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = true
      vi.mocked(mockAuthState).user = mockUser
      
      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })
  })

  describe('role-based access control', () => {
    it('allows access when user role is in allowedRoles', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = true
      vi.mocked(mockAuthState).user = mockUser // mockUser has role 'student'
      
      render(
        <BrowserRouter>
          <ProtectedRoute allowedRoles={['student', 'faculty']}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByText('Access denied')).not.toBeInTheDocument()
    })

    it('denies access when user role is not in allowedRoles', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = true
      vi.mocked(mockAuthState).user = mockUser // mockUser has role 'student'
      
      render(
        <BrowserRouter>
          <ProtectedRoute allowedRoles={['authority']}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      expect(screen.getByText('403')).toBeInTheDocument()
      expect(screen.getByText('Access denied')).toBeInTheDocument()
      expect(screen.getByText("You don't have permission to access this page.")).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('allows access to authority users when role is included', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = true
      vi.mocked(mockAuthState).user = mockAuthorityUser
      
      render(
        <BrowserRouter>
          <ProtectedRoute allowedRoles={['authority']}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
      expect(screen.queryByText('Access denied')).not.toBeInTheDocument()
    })

    it('allows access when no allowedRoles specified (any authenticated user)', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = true
      vi.mocked(mockAuthState).user = mockUser
      
      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('allows access to multiple roles', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = true
      vi.mocked(mockAuthState).user = mockAuthorityUser
      
      render(
        <BrowserRouter>
          <ProtectedRoute allowedRoles={['student', 'faculty', 'authority']}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles empty allowedRoles array', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = true
      vi.mocked(mockAuthState).user = mockUser
      
      render(
        <BrowserRouter>
          <ProtectedRoute allowedRoles={[]}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      // Empty allowedRoles should deny access to all users
      expect(screen.getByText('Access denied')).toBeInTheDocument()
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })

    it('handles null user with allowedRoles', () => {
      vi.mocked(mockAuthState).isLoading = false
      vi.mocked(mockAuthState).isAuthenticated = false
      vi.mocked(mockAuthState).user = null
      
      render(
        <BrowserRouter>
          <ProtectedRoute allowedRoles={['student']}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      )
      
      // Should redirect to login, not show access denied
      expect(screen.queryByText('Access denied')).not.toBeInTheDocument()
      expect(screen.getByTestId('navigate')).toBeInTheDocument()
    })
  })
})