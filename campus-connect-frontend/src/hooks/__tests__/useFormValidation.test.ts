import { describe, it, expect } from 'vitest'
import { renderHook, act } from '../../test/utils'
import useFormValidation from '../useFormValidation'

describe('useFormValidation', () => {
  describe('basic validation rules', () => {
    it('validates required fields correctly', () => {
      const rules = {
        name: { required: true },
        email: { required: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ name: '', email: 'test@example.com' })
        expect(isValid).toBe(false)
        expect(result.current.errors.name).toBe('Name is required')
        expect(result.current.errors.email).toBeUndefined()
      })
    })

    it('validates email format correctly', () => {
      const rules = {
        email: { email: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ email: 'invalid-email' })
        expect(isValid).toBe(false)
        expect(result.current.errors.email).toBe('Please enter a valid email address')
      })

      act(() => {
        const isValid = result.current.validateForm({ email: 'valid@example.com' })
        expect(isValid).toBe(true)
        expect(result.current.errors.email).toBeUndefined()
      })
    })

    it('validates password format correctly', () => {
      const rules = {
        password: { password: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ password: 'weak' })
        expect(isValid).toBe(false)
        expect(result.current.errors.password).toBe('Password must be at least 8 characters with uppercase, lowercase, and number')
      })

      act(() => {
        const isValid = result.current.validateForm({ password: 'StrongPass123' })
        expect(isValid).toBe(true)
        expect(result.current.errors.password).toBeUndefined()
      })
    })

    it('validates minimum length correctly', () => {
      const rules = {
        username: { minLength: 3 }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ username: 'ab' })
        expect(isValid).toBe(false)
        expect(result.current.errors.username).toBe('Username must be at least 3 characters')
      })

      act(() => {
        const isValid = result.current.validateForm({ username: 'abc' })
        expect(isValid).toBe(true)
        expect(result.current.errors.username).toBeUndefined()
      })
    })

    it('validates maximum length correctly', () => {
      const rules = {
        bio: { maxLength: 10 }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ bio: 'This is too long' })
        expect(isValid).toBe(false)
        expect(result.current.errors.bio).toBe('Bio must be no more than 10 characters')
      })

      act(() => {
        const isValid = result.current.validateForm({ bio: 'Short bio' })
        expect(isValid).toBe(true)
        expect(result.current.errors.bio).toBeUndefined()
      })
    })
  })

  describe('advanced validation', () => {
    it('validates confirm password correctly', () => {
      const rules = {
        password: { required: true },
        confirmPassword: { confirmPassword: 'password' }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ 
          password: 'password123', 
          confirmPassword: 'different' 
        })
        expect(isValid).toBe(false)
        expect(result.current.errors.confirmPassword).toBe('Passwords do not match')
      })

      act(() => {
        const isValid = result.current.validateForm({ 
          password: 'password123', 
          confirmPassword: 'password123' 
        })
        expect(isValid).toBe(true)
        expect(result.current.errors.confirmPassword).toBeUndefined()
      })
    })

    it('validates custom patterns correctly', () => {
      const rules = {
        phoneNumber: { pattern: /^\d{10}$/ }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ phoneNumber: '123-456-7890' })
        expect(isValid).toBe(false)
        expect(result.current.errors.phoneNumber).toBe('Phone number format is invalid')
      })

      act(() => {
        const isValid = result.current.validateForm({ phoneNumber: '1234567890' })
        expect(isValid).toBe(true)
        expect(result.current.errors.phoneNumber).toBeUndefined()
      })
    })

    it('validates custom validation functions correctly', () => {
      const rules = {
        age: { 
          custom: (value: string) => {
            const age = parseInt(value)
            if (isNaN(age)) return 'Age must be a number'
            if (age < 18) return 'Must be at least 18 years old'
            if (age > 120) return 'Age must be realistic'
            return null
          }
        }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ age: '15' })
        expect(isValid).toBe(false)
        expect(result.current.errors.age).toBe('Must be at least 18 years old')
      })

      act(() => {
        const isValid = result.current.validateForm({ age: '25' })
        expect(isValid).toBe(true)
        expect(result.current.errors.age).toBeUndefined()
      })
    })
  })

  describe('individual field validation', () => {
    it('validates single field correctly', () => {
      const rules = {
        email: { required: true, email: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateField('email', '')
        expect(isValid).toBe(false)
        expect(result.current.errors.email).toBe('Email is required')
      })

      act(() => {
        const isValid = result.current.validateField('email', 'invalid')
        expect(isValid).toBe(false)
        expect(result.current.errors.email).toBe('Please enter a valid email address')
      })

      act(() => {
        const isValid = result.current.validateField('email', 'valid@example.com')
        expect(isValid).toBe(true)
        expect(result.current.errors.email).toBeUndefined()
      })
    })

    it('validates field with form data context for confirm password', () => {
      const rules = {
        password: { required: true },
        confirmPassword: { confirmPassword: 'password' }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const formData = { password: 'test123', confirmPassword: 'different' }
        const isValid = result.current.validateField('confirmPassword', 'different', formData)
        expect(isValid).toBe(false)
        expect(result.current.errors.confirmPassword).toBe('Passwords do not match')
      })
    })
  })

  describe('error management', () => {
    it('clears individual errors correctly', () => {
      const rules = {
        name: { required: true },
        email: { required: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        result.current.validateForm({ name: '', email: '' })
        expect(result.current.errors.name).toBeTruthy()
        expect(result.current.errors.email).toBeTruthy()
      })

      act(() => {
        result.current.clearError('name')
        expect(result.current.errors.name).toBeUndefined()
        expect(result.current.errors.email).toBeTruthy()
      })
    })

    it('clears all errors correctly', () => {
      const rules = {
        name: { required: true },
        email: { required: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        result.current.validateForm({ name: '', email: '' })
        expect(result.current.hasErrors).toBe(true)
      })

      act(() => {
        result.current.clearAllErrors()
        expect(result.current.hasErrors).toBe(false)
        expect(Object.keys(result.current.errors)).toHaveLength(0)
      })
    })

    it('sets custom errors correctly', () => {
      const rules = {}
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        result.current.setError('customField', 'Custom error message')
        expect(result.current.errors.customField).toBe('Custom error message')
        expect(result.current.hasErrors).toBe(true)
      })
    })

    it('checks field validity correctly', () => {
      const rules = {
        name: { required: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      expect(result.current.isFieldValid('name')).toBe(true)

      act(() => {
        result.current.validateForm({ name: '' })
      })

      expect(result.current.isFieldValid('name')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('handles empty rules object', () => {
      const { result } = renderHook(() => useFormValidation({}))

      act(() => {
        const isValid = result.current.validateForm({ anyField: 'anyValue' })
        expect(isValid).toBe(true)
        expect(result.current.hasErrors).toBe(false)
      })
    })

    it('handles validation of non-existent fields', () => {
      const rules = {
        name: { required: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateField('nonExistentField', 'value')
        expect(isValid).toBe(true)
      })
    })

    it('handles whitespace-only values for required fields', () => {
      const rules = {
        name: { required: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        const isValid = result.current.validateForm({ name: '   ' })
        expect(isValid).toBe(false)
        expect(result.current.errors.name).toBe('Name is required')
      })
    })

    it('handles camelCase field names in display', () => {
      const rules = {
        firstName: { required: true },
        lastName: { required: true }
      }
      
      const { result } = renderHook(() => useFormValidation(rules))

      act(() => {
        result.current.validateForm({ firstName: '', lastName: '' })
        expect(result.current.errors.firstName).toBe('First name is required')
        expect(result.current.errors.lastName).toBe('Last name is required')
      })
    })
  })
})