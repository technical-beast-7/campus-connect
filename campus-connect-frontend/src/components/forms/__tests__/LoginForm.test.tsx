import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, userEvent, waitFor } from '../../../test/utils'
import LoginForm from '../LoginForm'

// Mock the AuthContext
const mockLogin = vi.fn()
const mockAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    state: mockAuthState
  })
}))

// Mock the validation hook
const mockValidateForm = vi.fn()
const mockErrors = {}

vi.mock('../../../hooks/useFormValidation', () => ({
  default: () => ({
    validateForm: mockValidateForm,
    errors: mockErrors
  })
}))

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockValidateForm.mockReturnValue(true)
    Object.assign(mockAuthState, {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
    Object.keys(mockErrors).forEach(key => delete mockErrors[key])
  })

  describe('rendering', () => {
    it('renders login form with all required fields', () => {
      render(<LoginForm onSuccess={mockOnSuccess} />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('has proper form attributes', () => {
      render(<LoginForm />)

      const form = screen.getByLabelText(/email/i).closest('form')
      expect(form).toHaveAttribute('noValidate')
    })

    it('has proper input attributes', () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')

      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
    })
  })

  describe('user interactions', () => {
    it('updates email field when user types', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@example.com')

      expect(emailInput).toHaveValue('test@example.com')
    })

    it('updates password field when user types', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const passwordInput = screen.getByLabelText(/password/i)
      await user.type(passwordInput, 'password123')

      expect(passwordInput).toHaveValue('password123')
    })

    it('submits form with correct data when valid', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue(undefined)
      
      render(<LoginForm onSuccess={mockOnSuccess} />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(mockValidateForm).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('calls onSuccess callback after successful login', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue(undefined)
      
      render(<LoginForm onSuccess={mockOnSuccess} />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('does not submit form when validation fails', async () => {
      const user = userEvent.setup()
      mockValidateForm.mockReturnValue(false)
      
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /login/i })
      await user.click(submitButton)

      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  describe('validation and error handling', () => {
    it('displays email validation errors', () => {
      Object.assign(mockErrors, { email: 'Please enter a valid email address' })
      
      render(<LoginForm />)

      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent('Please enter a valid email address')
      expect(errorMessage).toHaveAttribute('id', 'email-error')

      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('displays password validation errors', () => {
      Object.assign(mockErrors, { password: 'Password must be at least 6 characters' })
      
      render(<LoginForm />)

      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent('Password must be at least 6 characters')
      expect(errorMessage).toHaveAttribute('id', 'password-error')

      const passwordInput = screen.getByLabelText(/password/i)
      expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error')
      expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('displays authentication errors from context', () => {
      Object.assign(mockAuthState, { error: 'Invalid email or password' })
      
      render(<LoginForm />)

      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toHaveTextContent('Invalid email or password')
      expect(errorAlert).toHaveClass('alert-error')
    })

    it('handles login errors gracefully', async () => {
      const user = userEvent.setup()
      mockLogin.mockRejectedValue(new Error('Network error'))
      
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      // Error should be handled by AuthContext, form should not crash
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })
  })

  describe('loading states', () => {
    it('shows loader when authentication is loading', () => {
      Object.assign(mockAuthState, { isLoading: true })
      
      render(<LoginForm />)

      expect(screen.getByText('Logging in...')).toBeInTheDocument()
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    })

    it('disables submit button when loading', () => {
      Object.assign(mockAuthState, { isLoading: true })
      
      render(<LoginForm />)

      // When loading, the form is replaced with loader, so no button should be present
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('shows loading text on submit button during form submission', async () => {
      const user = userEvent.setup()
      // Mock a delayed login to test loading state
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      // The button should be disabled during submission (based on isLoading state)
      expect(submitButton).toHaveAttribute('disabled')
    })
  })

  describe('accessibility', () => {
    it('has proper form labels and associations', () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      expect(emailInput).toHaveAttribute('id', 'email')
      expect(passwordInput).toHaveAttribute('id', 'password')

      const emailLabel = screen.getByText('Email')
      const passwordLabel = screen.getByText('Password')

      expect(emailLabel).toHaveAttribute('for', 'email')
      expect(passwordLabel).toHaveAttribute('for', 'password')
    })

    it('has proper ARIA attributes for validation errors', () => {
      Object.assign(mockErrors, { email: 'Invalid email' })
      
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const errorMessage = screen.getByRole('alert')

      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })

    it('has proper keyboard navigation support', () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      expect(emailInput).toHaveClass('keyboard-nav')
      expect(passwordInput).toHaveClass('keyboard-nav')
      // Submit button should be focusable by default
      expect(submitButton).not.toHaveAttribute('tabindex', '-1')
    })
  })

  describe('edge cases', () => {
    it('handles form submission without onSuccess callback', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue(undefined)
      
      render(<LoginForm />) // No onSuccess prop

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(mockLogin).toHaveBeenCalled()
      // Should not throw error when onSuccess is undefined
    })

    it('handles empty form submission', async () => {
      const user = userEvent.setup()
      mockValidateForm.mockReturnValue(false)
      
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /login/i })
      await user.click(submitButton)

      expect(mockValidateForm).toHaveBeenCalledWith({
        email: '',
        password: ''
      })
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('handles special characters in input fields', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)

      await user.type(emailInput, 'test+tag@example.com')
      await user.type(passwordInput, 'p@ssw0rd!@#$%')

      expect(emailInput).toHaveValue('test+tag@example.com')
      expect(passwordInput).toHaveValue('p@ssw0rd!@#$%')
    })
  })
})