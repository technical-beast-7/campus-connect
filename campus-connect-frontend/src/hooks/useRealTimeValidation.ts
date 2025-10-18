import { useState, useCallback } from 'react';
import useFormValidation from './useFormValidation';

interface UseRealTimeValidationReturn {
  formData: Record<string, string>;
  errors: Record<string, string>;
  isValid: boolean;
  hasErrors: boolean;
  handleChange: (name: string, value: string) => void;
  handleBlur: (name: string) => void;
  handleSubmit: (onSubmit: (data: Record<string, string>) => void) => (e: React.FormEvent) => void;
  setFieldValue: (name: string, value: string) => void;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
  clearAllErrors: () => void;
  resetForm: (initialData?: Record<string, string>) => void;
  isFieldValid: (name: string) => boolean;
  isFieldTouched: (name: string) => boolean;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  email?: boolean;
  password?: boolean;
  confirmPassword?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

const useRealTimeValidation = (
  validationRules: ValidationRules,
  initialData: Record<string, string> = {},
  validateOnChange: boolean = true,
  validateOnBlur: boolean = true
): UseRealTimeValidationReturn => {
  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  const {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    setError,
    hasErrors,
    isFieldValid
  } = useFormValidation(validationRules);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      clearError(name);
    }

    // Validate on change if enabled and field has been touched
    if (validateOnChange && touchedFields[name]) {
      setTimeout(() => {
        validateField(name, value, { ...formData, [name]: value });
      }, 300); // Debounce validation
    }
  }, [formData, errors, touchedFields, validateOnChange, validateField, clearError]);

  const handleBlur = useCallback((name: string) => {
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      const value = formData[name] || '';
      validateField(name, value, formData);
    }
  }, [formData, validateOnBlur, validateField]);

  const handleSubmit = useCallback((onSubmit: (data: Record<string, string>) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allFieldsTouched = Object.keys(validationRules).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouchedFields(allFieldsTouched);

      // Validate entire form
      const isFormValid = validateForm(formData);
      
      if (isFormValid) {
        onSubmit(formData);
      }
    };
  }, [formData, validationRules, validateForm]);

  const setFieldValue = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setError(name, error);
  }, [setError]);

  const clearFieldError = useCallback((name: string) => {
    clearError(name);
  }, [clearError]);

  const resetForm = useCallback((newInitialData?: Record<string, string>) => {
    setFormData(newInitialData || initialData);
    setTouchedFields({});
    clearAllErrors();
  }, [initialData, clearAllErrors]);

  const isFieldTouched = useCallback((name: string): boolean => {
    return !!touchedFields[name];
  }, [touchedFields]);

  // Calculate if form is valid (no errors and all required fields have values)
  const isValid = !hasErrors && Object.keys(validationRules).every(field => {
    const rule = validationRules[field];
    const value = formData[field];
    
    if (rule.required) {
      return value && value.trim() !== '';
    }
    return true;
  });

  return {
    formData,
    errors,
    isValid,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError: setFieldError,
    clearFieldError,
    clearAllErrors,
    resetForm,
    isFieldValid,
    isFieldTouched
  };
};

export default useRealTimeValidation;