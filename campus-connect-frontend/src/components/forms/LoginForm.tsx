import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useFormValidation from '../../hooks/useFormValidation';
import { Loader } from '../ui';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, state } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const validationRules = {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 }
  };
  
  const { validateForm, errors } = useFormValidation(validationRules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData as unknown as Record<string, string>)) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      onSuccess?.();
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (state.isLoading) {
    return <Loader text="Logging in..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" noValidate>
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
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-input w-full input-mobile keyboard-nav"
          required
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={errors.password ? "true" : "false"}
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p id="password-error" className="error-text animate-fade-in" role="alert">
            {errors.password}
          </p>
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
        disabled={state.isLoading}
        className="btn-primary w-full btn-mobile disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {state.isLoading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            Logging in...
          </div>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
};

export default LoginForm;