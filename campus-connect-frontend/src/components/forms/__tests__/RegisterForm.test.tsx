import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, userEvent, waitFor } from '../../../test/utils'
import { renderWithProviders } from '../../../test/utils'
import RegisterForm from '../RegisterForm'

// Mock the AuthContext
const mockRegister = vi.fn()
const mockAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
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

describe('RegisterForm', () => {
  const mockOnSuccess = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockValidateForm.mockReturnValue(true)
  })

  describe('rendering', () => {
    it('renders all form fields correctly', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/department/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
    })

    it('renders form fields with correct attributes', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const departmentInput = screen.getByLabelText(/department/i)
      const roleSelect = screen.getByLabelText(/role/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      expect(nameInput).toHaveAttribute('type', 'text')
      expect(nameInput).toHaveAttribute('name', 'name')
      expect(nameInput).toHaveAttribute('required')
      expect(nameInput).toHaveAttribute('autoComplete', 'name')
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('name', 'email')
      expect(emailInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')
      
      expect(departmentInput).toHaveAttribute('type', 'text')
      expect(departmentInput).toHaveAttribute('name', 'department')
      expect(departmentInput).toHaveAttribute('required')
      
      expect(roleSelect).toHaveAttribute('name', 'role')
      expect(roleSelect).toHaveAttribute('required')
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('name', 'password')
      expect(passwordInput).toHaveAttribute('required')
      
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('name', 'confirmPassword')
      expect(confirmPasswordInput).toHaveAttribute('required')
    })

    it('has proper form structure and accessibility', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('noValidate')
      
      const nameLabel = screen.getByText(/full name/i)
      const emailLabel = screen.getByText(/email/i)
      const roleLabel = screen.getByText(/role/i)
      
      expect(nameLabel).toHaveClass('form-label-required')
      expect(emailLabel).toHaveClass('form-label-required')
      expect(roleLabel).toHaveClass('form-label-required')
    })

    it('renders role options correctly', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const roleSelect = screen.getByLabelText(/role/i)
      expect(roleSelect).toHaveValue('student') // Default value
      
      const studentOption = screen.getByRole('option', { name: /student/i })
      const facultyOption = screen.getByRole('option', { name: /faculty/i })
      const authorityOption = screen.getByRole('option', { name: /authority/i })
      
      expect(studentOption).toBeInTheDocument()
      expect(facultyOption).toBeInTheDocument()
      expect(authorityOption).toBeInTheDocument()
    })

    it('includes role help text', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const helpText = screen.getByText(/Select your role: Student\/Faculty can report issues/i)
      expect(helpText).toBeInTheDocument()
      expect(helpText).toHaveAttribute('id', 'role-help')
      
      const roleSelect = screen.getByLabelText(/role/i)
      expect(roleSelect).toHaveAttribute('aria-describedby', 'role-help')
    })
  })

  describe('user interactions', () => {
    it('updates form fields when user types', async () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const departmentInput = screen.getByLabelText(/department/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(departmentInput, 'Computer Science')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      
      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')
      expect(departmentInput).toHaveValue('Computer Science')
      expect(passwordInput).toHaveValue('password123')
      expect(confirmPasswordInput).toHaveValue('password123')
    })

    it('updates role selection', async () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const roleSelect = screen.getByLabelText(/role/i)
      await user.selectOptions(roleSelect, 'faculty')
      
      expect(roleSelect).toHaveValue('faculty')
    })

    it('calls register function with correct data on form submission', async () => {
      mockRegister.mockResolvedValueOnce(undefined)
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const departmentInput = screen.getByLabelText(/department/i)
      const roleSelect = screen.getByLabelText(/role/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /register/i })
      
      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(departmentInput, 'Computer Science')
      await user.selectOptions(roleSelect, 'faculty')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockValidateForm).toHaveBeenCalled()
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          department: 'Computer Science',
          role: 'faculty',
          password: 'password123'
        })
      })
    })

    it('calls onSuccess callback after successful registration', async () => {
      mockRegister.mockResolvedValueOnce(undefined)
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      // Fill form with valid data
      await user.type(screen.getByLabelText(/full name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/department/i), 'Computer Science')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /register/i }))
      
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })
  })

  describe('form validation', () => {
    it('does not submit form when validation fails', async () => {
      mockValidateForm.mockReturnValue(false)
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const submitButton = screen.getByRole('button', { name: /register/i })
      await user.click(submitButton)
      
      expect(mockRegister).not.toHaveBeenCalled()
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('displays validation errors when present', () => {
      vi.mocked(mockErrors).name = 'Name is required'
      
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveTextContent('Name is required')
      expect(errorMessage).toHaveAttribute('id', 'name-error')
    })

    it('shows password mismatch error', async () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'different')
      
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    it('does not submit when passwords do not match', async () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      // Fill form with mismatched passwords
      await user.type(screen.getByLabelText(/full name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/department/i), 'Computer Science')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'different')
      
      const submitButton = screen.getByRole('button', { name: /register/i })
      expect(submitButton).toBeDisabled()
      
      await user.click(submitButton)
      expect(mockRegister).not.toHaveBeenCalled()
    })

    it('sets aria-invalid and aria-describedby when field has error', () => {
      vi.mocked(mockErrors).name = 'Name is required'
      
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      expect(nameInput).toHaveAttribute('aria-invalid', 'true')
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error')
    })
  })

  describe('loading states', () => {
    it('shows loader when registration is in progress', () => {
      vi.mocked(mockAuthState).isLoading = true
      
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText('Creating account...')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /register/i })).not.toBeInTheDocument()
    })

    it('shows loading text on submit button when not in loading state', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const submitButton = screen.getByRole('button', { name: /register/i })
      expect(submitButton).toHaveTextContent('Register')
    })
  })

  describe('error handling', () => {
    it('displays authentication error when present', () => {
      vi.mocked(mockAuthState).error = 'Email already exists'
      
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toHaveTextContent('Email already exists')
      expect(errorAlert).toHaveClass('alert-error')
      expect(errorAlert).toHaveAttribute('aria-live', 'polite')
    })

    it('includes screen reader text for errors', () => {
      vi.mocked(mockAuthState).error = 'Registration failed'
      
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const srText = screen.getByText('Error:', { exact: false })
      expect(srText).toHaveClass('sr-only')
    })

    it('handles registration failure gracefully', async () => {
      mockRegister.mockRejectedValueOnce(new Error('Registration failed'))
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      // Fill form with valid data
      await user.type(screen.getByLabelText(/full name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/department/i), 'Computer Science')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /register/i }))
      
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled()
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })
    })
  })

  describe('accessibility', () => {
    it('has proper form labels and associations', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const departmentInput = screen.getByLabelText(/department/i)
      const roleSelect = screen.getByLabelText(/role/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      expect(nameInput).toHaveAccessibleName()
      expect(emailInput).toHaveAccessibleName()
      expect(departmentInput).toHaveAccessibleName()
      expect(roleSelect).toHaveAccessibleName()
      expect(passwordInput).toHaveAccessibleName()
      expect(confirmPasswordInput).toHaveAccessibleName()
    })

    it('includes keyboard navigation classes', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const roleSelect = screen.getByLabelText(/role/i)
      
      expect(nameInput).toHaveClass('keyboard-nav')
      expect(emailInput).toHaveClass('keyboard-nav')
      expect(roleSelect).toHaveClass('keyboard-nav')
    })

    it('has mobile-friendly input classes', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const departmentInput = screen.getByLabelText(/department/i)
      const roleSelect = screen.getByLabelText(/role/i)
      
      expect(nameInput).toHaveClass('input-mobile')
      expect(emailInput).toHaveClass('input-mobile')
      expect(departmentInput).toHaveClass('input-mobile')
      expect(roleSelect).toHaveClass('input-mobile')
    })
  })

  describe('submit button state', () => {
    it('enables submit button when passwords match and form is valid', async () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      
      const submitButton = screen.getByRole('button', { name: /register/i })
      expect(submitButton).not.toBeDisabled()
    })

    it('disables submit button when passwords do not match', async () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'different')
      
      const submitButton = screen.getByRole('button', { name: /register/i })
      expect(submitButton).toBeDisabled()
    })

    it('has proper touch-friendly classes', () => {
      renderWithProviders(<RegisterForm onSuccess={mockOnSuccess} />)
      
      const submitButton = screen.getByRole('button', { name: /register/i })
      expect(submitButton).toHaveClass('btn-touch')
    })
  })
})