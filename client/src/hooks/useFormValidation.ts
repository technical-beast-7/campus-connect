import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  email?: boolean;
  password?: boolean;
  confirmPassword?: string; // field name to match against
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormValidationReturn {
  errors: FormErrors;
  validateField: (name: string, value: string, formData?: Record<string, string>) => boolean;
  validateForm: (formData: Record<string, string>) => boolean;
  clearError: (name: string) => void;
  clearAllErrors: () => void;
  setError: (name: string, error: string) => void;
  hasErrors: boolean;
  isFieldValid: (name: string) => boolean;
}

// Common validation patterns
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

const useFormValidation = (rules: ValidationRules): UseFormValidationReturn => {
  const [errors, setErrors] = useState<FormErrors>({});

  const getFieldDisplayName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const validateField = useCallback((name: string, value: string, formData?: Record<string, string>): boolean => {
    const rule = rules[name];
    if (!rule) return true;

    let error = '';
    const displayName = getFieldDisplayName(name);

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      error = `${displayName} is required`;
    }
    // Email validation
    else if (rule.email && value && !EMAIL_PATTERN.test(value)) {
      error = 'Please enter a valid email address';
    }
    // Password validation
    else if (rule.password && value && !PASSWORD_PATTERN.test(value)) {
      error = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    // Confirm password validation
    else if (rule.confirmPassword && formData) {
      const originalPassword = formData[rule.confirmPassword];
      if (value !== originalPassword) {
        error = 'Passwords do not match';
      }
    }
    // Min length validation
    else if (rule.minLength && value && value.length < rule.minLength) {
      error = `${displayName} must be at least ${rule.minLength} characters`;
    }
    // Max length validation
    else if (rule.maxLength && value && value.length > rule.maxLength) {
      error = `${displayName} must be no more than ${rule.maxLength} characters`;
    }
    // Pattern validation
    else if (rule.pattern && value && !rule.pattern.test(value)) {
      error = `${displayName} format is invalid`;
    }
    // Custom validation
    else if (rule.custom && value) {
      const customError = rule.custom(value);
      if (customError) {
        error = customError;
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, string>): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    Object.keys(rules).forEach(fieldName => {
      const value = formData[fieldName] || '';
      const rule = rules[fieldName];
      let error = '';
      const displayName = getFieldDisplayName(fieldName);

      // Required validation
      if (rule.required && (!value || value.trim() === '')) {
        error = `${displayName} is required`;
      }
      // Email validation
      else if (rule.email && value && !EMAIL_PATTERN.test(value)) {
        error = 'Please enter a valid email address';
      }
      // Password validation
      else if (rule.password && value && !PASSWORD_PATTERN.test(value)) {
        error = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      }
      // Confirm password validation
      else if (rule.confirmPassword) {
        const originalPassword = formData[rule.confirmPassword];
        if (value !== originalPassword) {
          error = 'Passwords do not match';
        }
      }
      // Min length validation
      else if (rule.minLength && value && value.length < rule.minLength) {
        error = `${displayName} must be at least ${rule.minLength} characters`;
      }
      // Max length validation
      else if (rule.maxLength && value && value.length > rule.maxLength) {
        error = `${displayName} must be no more than ${rule.maxLength} characters`;
      }
      // Pattern validation
      else if (rule.pattern && value && !rule.pattern.test(value)) {
        error = `${displayName} format is invalid`;
      }
      // Custom validation
      else if (rule.custom && value) {
        const customError = rule.custom(value);
        if (customError) {
          error = customError;
        }
      }

      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules]);

  const clearError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const hasErrors = Object.keys(errors).some(key => errors[key]);

  const isFieldValid = useCallback((name: string): boolean => {
    return !errors[name];
  }, [errors]);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    setError,
    hasErrors,
    isFieldValid
  };
};

export default useFormValidation;
