import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { ProfileData } from '../types';
import useFormValidation from '../hooks/useFormValidation';
import Loader from '../components/ui/Loader';
import { UserIcon, EnvelopeIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { state, updateProfile, clearError } = useAuth();
  const { user, isLoading, error } = state;

  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    department: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    department: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
  };

  const { errors, validateForm, clearAllErrors } = useFormValidation(validationRules);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department,
      });
    }
  }, [user]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear success message when user starts editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    clearAllErrors();
    clearError();
    setSuccessMessage('');

    // Validate form
    if (!validateForm(formData as unknown as Record<string, string>)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      // Error is handled by the context and will appear in the error state
      console.error('Profile update failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department,
      });
      clearAllErrors();
      clearError();
      setSuccessMessage('');
    }
  };

  // Show loading state while user data is being fetched
  if (!user && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  // Show error if user is not found
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences.</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Department Field */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your department"
                />
              </div>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* Role Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <span className="text-gray-900 capitalize">{user.role}</span>
                <span className="text-gray-500 text-sm ml-2">(Cannot be changed)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader size="sm" className="mr-2" />
                    Updating...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting || isLoading}
                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">User ID:</span>
              <span className="ml-2 text-gray-900 font-mono">{user.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Member since:</span>
              <span className="ml-2 text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;