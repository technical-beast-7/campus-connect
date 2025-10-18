import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useFormValidation from '../../hooks/useFormValidation';
import { Loader } from '../ui';
import type { RegisterData } from '../../types';

interface RegisterFormProps {
  onSuccess?: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
  role: 'student' | 'faculty' | 'authority';
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register, state } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'student',
  });

  const validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, password: true },
    confirmPassword: { required: true, confirmPassword: 'password' },
    department: { required: true, minLength: 2 },
    role: { required: true }
  };
  
  const { validateForm, errors } = useFormValidation(validationRules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData as unknown as Record<string, string>)) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      const registerData: RegisterData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        role: formData.role,
      };
      
      await register(registerData);
      onSuccess?.();
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (state.isLoading) {
    return <Loader text="Creating account..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" noValidate>
      <div>
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input w-full input-mobile keyboard-nav"
          required
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={errors.name ? "true" : "false"}
          autoComplete="name"
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p id="name-error" className="error-text animate-fade-in" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input w-full input-mobile keyboard-nav"
          required
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={errors.email ? "true" : "false"}
          autoComplete="email"
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p id="email-error" className="error-text animate-fade-in" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="department" className="form-label">
          Department
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="form-input w-full input-mobile"
          required
          placeholder="e.g., Computer Science, Mathematics"
        />
        {errors.department && <p className="error-text animate-fade-in">{errors.department}</p>}
      </div>

      <div>
        <label htmlFor="role" className="form-label">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-input w-full select-mobile keyboard-nav"
          required
          aria-describedby="role-help"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="authority">Authority</option>
        </select>
        <div id="role-help" className="help-text">
          Select your role: Student/Faculty can report issues, Authority can manage and resolve issues
        </div>
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input w-full input-mobile"
          required
          placeholder="Create a secure password"
          autoComplete="new-password"
        />
        {errors.password && <p className="error-text animate-fade-in">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input w-full input-mobile"
          required
          placeholder="Confirm your password"
          autoComplete="new-password"
        />
        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <p className="error-text animate-fade-in">Passwords do not match</p>
        )}
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fade-in" role="alert" aria-live="polite">
          <span className="sr-only">Error: </span>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{state.error}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={state.isLoading || formData.password !== formData.confirmPassword}
        className="btn-primary w-full btn-mobile disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {state.isLoading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            Creating Account...
          </div>
        ) : (
          'Register'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;