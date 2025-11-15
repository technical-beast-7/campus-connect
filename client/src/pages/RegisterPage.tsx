import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import useFormValidation from '@hooks/useFormValidation';
import { isValidEmail, isValidPassword } from '@utils/helpers';
import OTPModal from '@components/OTPModal';
import SuccessModal from '@components/SuccessModal';
import PasswordRequirements from '@components/PasswordRequirements';
import api from '@services/api';
import type { RegisterData } from '@/types';

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
  category?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, register, clearError } = useAuth();
  const [activeTab, setActiveTab] = useState<'user' | 'authority'>('user');
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    department: '',
    category: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Department options (for users only)
  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Business Administration',
  ];

  // Category options (for authorities only)
  const categories = [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'canteen', label: 'Canteen' },
    { value: 'classroom', label: 'Classroom' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'transport', label: 'Transport' },
    { value: 'other', label: 'Other' }
  ];

  // Form validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      custom: (value: string) => {
        if (!isValidEmail(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      }
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value: string) => {
        if (!isValidPassword(value)) {
          return 'Password must contain at least 8 characters with uppercase, lowercase, and number';
        }
        return null;
      }
    },
    confirmPassword: {
      required: true,
      custom: (value: string) => {
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return null;
      }
    },
    department: {
      required: false
    }
  };

  const { errors, validateField, validateForm, clearAllErrors } = useFormValidation(validationRules);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    clearAllErrors();
  }, [clearError, clearAllErrors]);

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      const redirectPath = state.user.role === 'authority' ? '/dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [state.isAuthenticated, state.user, navigate]);

  // Update role when tab changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      role: activeTab === 'user' ? 'user' : 'authority'
    }));
  }, [activeTab]);

  const handleTabChange = (tab: 'user' | 'authority') => {
    setActiveTab(tab);
    // Reset department and category when switching tabs
    setFormData(prev => ({
      ...prev,
      department: '',
      category: ''
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Always validate password fields on change to show real-time feedback
    if (name === 'password' || name === 'confirmPassword') {
      validateField(name, value);
    } else if (errors[name]) {
      // For other fields, only validate if there's already an error
      validateField(name, value);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted!', formData);
    
    // Additional validation for authorities
    if (activeTab === 'authority') {
      if (!formData.category) {
        alert('Please select a category');
        return;
      }
      // Set department to empty string for authorities before validation
      formData.department = '';
    }
    
    // Validate form
    if (!validateForm(formData as unknown as Record<string, string>)) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, sending OTP...');

    try {
      const { confirmPassword, category, ...registerData } = formData;
      
      // For authorities, leave department empty and set categories array
      if (activeTab === 'authority') {
        const authorityData = {
          ...registerData,
          department: '',
          categories: category ? [category] : []
        };
        
        console.log('Sending request to /auth/send-otp');
        
        // Send OTP to email
        const response = await api.post('/auth/send-otp', authorityData);
        
        console.log('OTP Response:', response.data);
        
        if (response.data.success) {
          // Show OTP modal
          console.log('Showing OTP modal');
          setShowOTPModal(true);
          clearError();
          
          // For development: log preview URL
          if (response.data.previewUrl) {
            console.log('📧 Email Preview URL:', response.data.previewUrl);
            // Open preview URL in new tab automatically
            window.open(response.data.previewUrl, '_blank');
            alert(`✅ OTP Email sent!\n\n📧 Email preview opened in new tab.\n\nCopy the OTP from the email and enter it below.`);
          } else {
            alert('OTP sent to your email! Check your inbox.');
          }
        }
        return;
      }
      
      // For users, send registerData as is
      console.log('Sending request to /auth/send-otp');
      
      // Send OTP to email
      const response = await api.post('/auth/send-otp', registerData);
      
      console.log('OTP Response:', response.data);
      
      if (response.data.success) {
        // Show OTP modal
        console.log('Showing OTP modal');
        setShowOTPModal(true);
        clearError();
        
        // For development: log preview URL
        if (response.data.previewUrl) {
          console.log('📧 Email Preview URL:', response.data.previewUrl);
          // Open preview URL in new tab automatically
          window.open(response.data.previewUrl, '_blank');
          alert(`✅ OTP Email sent!\n\n📧 Email preview opened in new tab.\n\nCopy the OTP from the email and enter it below.`);
        } else {
          alert('OTP sent to your email! Check your inbox.');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      console.error('OTP sending error:', error);
      console.error('Error details:', error.response?.data);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsOTPLoading(true);
    setOtpError(null);

    try {
      const response = await api.post('/auth/verify-otp', {
        email: formData.email,
        otp
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Close OTP modal and show success modal
        setShowOTPModal(false);
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
      console.error('OTP verification error:', error);
    } finally {
      setIsOTPLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpError(null);
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await api.post('/auth/send-otp', registerData);
      
      if (response.data.success) {
        alert('OTP resent successfully!');
        
        // For development: log preview URL
        if (response.data.previewUrl) {
          console.log('📧 Email Preview URL:', response.data.previewUrl);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP.';
      setOtpError(errorMessage);
    }
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    setOtpError(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Join Campus Connect
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>

        {/* Registration Form */}
        <div className="card">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => handleTabChange('user')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'user'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('authority')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'authority'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Authority
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Global Error Message */}
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{state.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`form-input w-full ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your full name"
                disabled={state.isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`form-input w-full ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your email"
                disabled={state.isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Department Field (for users) */}
            {activeTab === 'user' && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`form-input w-full ${errors.department ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  disabled={state.isLoading}
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
            )}

            {/* Category Field (for authorities) */}
            {activeTab === 'authority' && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="form-input w-full"
                  disabled={state.isLoading}
                >
                  <option value="">Select category you will handle</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={(e) => {
                    handleInputBlur(e);
                    // Keep requirements visible if password is not valid
                    if (isValidPassword(formData.password)) {
                      setShowPasswordRequirements(false);
                    }
                  }}
                  className={`form-input w-full pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Create a password"
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('password')}
                  disabled={state.isLoading}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Requirements Indicator */}
              <PasswordRequirements 
                password={formData.password} 
                show={showPasswordRequirements || (formData.password.length > 0 && !isValidPassword(formData.password))}
              />
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`form-input w-full pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Confirm your password"
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  disabled={state.isLoading}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={state.isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  state.isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                } transition-colors`}
              >
                {state.isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Role Information */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Account Types</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>User:</strong> Report issues and track their status</p>
            <p><strong>Authority:</strong> Manage and resolve reported issues</p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        email={formData.email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onClose={handleCloseOTPModal}
        isLoading={isOTPLoading}
        error={otpError}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Registration Successful! 🎉"
        message="Your account has been created and verified successfully."
        role={formData.role as 'user' | 'authority'}
        onClose={handleCloseSuccessModal}
        redirectTo="/dashboard"
        autoRedirectSeconds={3}
      />
    </div>
  );
};

export default RegisterPage;