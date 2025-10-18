import React, { useState } from 'react';
import { useRealTimeValidation, validationRules } from '../../hooks';
import { ErrorBoundary, withComponentErrorBoundary } from '../ui';

// Example form component using real-time validation
const ExampleForm: React.FC = () => {
  const {
    formData,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isFieldTouched
  } = useRealTimeValidation(validationRules.loginForm, {
    email: '',
    password: ''
  });

  const onSubmit = (data: Record<string, string>) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully!');
    resetForm();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Login Form Example</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.email && isFieldTouched('email')
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && isFieldTouched('email') && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.password && isFieldTouched('password')
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          {errors.password && isFieldTouched('password') && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!isValid}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              isValid
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
          
          <button
            type="button"
            onClick={() => resetForm()}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Form State:</h3>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify({ formData, errors, isValid }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Component that intentionally throws an error for testing
const ErrorThrowingComponent: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error for demonstrating ErrorBoundary');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Error Boundary Test</h2>
      <p className="text-gray-600 mb-4">
        Click the button below to trigger an error and see the ErrorBoundary in action.
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
      >
        Throw Error
      </button>
    </div>
  );
};

// Wrap the error-throwing component with ErrorBoundary
const SafeErrorThrowingComponent = withComponentErrorBoundary(ErrorThrowingComponent);

// Main example component
const ValidationAndErrorExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Validation and Error Handling Examples
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Validation Example */}
          <div>
            <ExampleForm />
          </div>
          
          {/* Error Boundary Example */}
          <div>
            <ErrorBoundary>
              <SafeErrorThrowingComponent />
            </ErrorBoundary>
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Usage Instructions</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900">Form Validation:</h3>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Real-time validation with debounced feedback</li>
                <li>Validation triggers on blur and after field is touched</li>
                <li>Submit button is disabled until form is valid</li>
                <li>Predefined validation rules for common fields</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Error Boundary:</h3>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Catches JavaScript errors in component tree</li>
                <li>Displays fallback UI instead of white screen</li>
                <li>Provides retry and recovery options</li>
                <li>Logs errors for debugging and reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationAndErrorExample;