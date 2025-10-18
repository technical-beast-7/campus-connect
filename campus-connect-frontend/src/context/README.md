# Authentication Context Documentation

## Overview

The AuthContext provides centralized authentication state management for the Campus Connect application. It handles user login, registration, logout, and session persistence across page refreshes.

## Features

- **User Authentication**: Login and registration with mock API calls
- **Session Persistence**: Automatically saves and restores user sessions using localStorage
- **Token Management**: Secure token storage and retrieval utilities
- **Error Handling**: Comprehensive error states and clearing mechanisms
- **Loading States**: Loading indicators during authentication operations
- **Role-based Access**: Support for different user roles (student, faculty, authority)

## Usage

### Basic Setup

The AuthProvider is already configured in App.tsx and wraps the entire application:

```tsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### Using the Auth Hook

```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { state, login, register, logout, clearError } = useAuth();

  // Access user data
  const user = state.user;
  const isAuthenticated = state.isAuthenticated;
  const isLoading = state.isLoading;
  const error = state.error;

  // Login
  const handleLogin = async () => {
    await login('user@example.com', 'password');
  };

  // Register
  const handleRegister = async () => {
    await register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'student',
      department: 'Computer Science'
    });
  };

  // Logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome, {user?.name}!</div>
      ) : (
        <div>Please log in</div>
      )}
    </div>
  );
}
```

## State Structure

```typescript
interface AuthState {
  user: User | null;           // Current user data
  isAuthenticated: boolean;    // Authentication status
  isLoading: boolean;         // Loading state for async operations
  error: string | null;       // Error message if any
}
```

## Available Actions

- `login(email, password)`: Authenticate user with email and password
- `register(userData)`: Register new user account
- `logout()`: Clear user session and redirect
- `clearError()`: Clear any error messages
- `initializeAuth()`: Initialize auth state from stored session

## Session Persistence

The authentication system automatically:

1. **Saves session data** to localStorage on successful login/register
2. **Restores session** on page refresh or app restart
3. **Clears session data** on logout
4. **Validates stored sessions** before restoring

## Token Management

Token utilities are available for advanced use cases:

```typescript
import { tokenStorage, sessionUtils, jwtUtils } from '../utils/auth';

// Check if user has valid session
const hasSession = sessionUtils.hasValidSession();

// Get stored token
const token = tokenStorage.get();

// Check if JWT token is expired (for future backend integration)
const isExpired = jwtUtils.isExpired(token);
```

## Mock Implementation

Currently uses mock data for development. When backend is ready:

1. Replace mock API calls in login/register functions
2. Update token handling to use real JWT tokens
3. Add proper error handling for API responses

## Testing

Use the AuthTest component to verify authentication functionality:

```tsx
import AuthTest from './components/AuthTest';

// Add to your route for testing
<Route path="/auth-test" element={<AuthTest />} />
```

## Requirements Fulfilled

- ✅ **11.1**: Authentication state management using React Context API
- ✅ **11.2**: Session persistence across page refreshes
- ✅ **11.3**: Proper logout functionality with session clearing
- ✅ **11.4**: Token storage and retrieval utilities