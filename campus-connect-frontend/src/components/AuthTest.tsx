import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Test component to demonstrate authentication functionality
const AuthTest: React.FC = () => {
  const { state, login, register, logout, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [role, setRole] = useState<'student' | 'faculty' | 'authority'>('student');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      name,
      email,
      password,
      role,
      department,
    });
  };

  if (state.isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Welcome!</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Name:</strong> {state.user?.name}</p>
          <p><strong>Email:</strong> {state.user?.email}</p>
          <p><strong>Role:</strong> {state.user?.role}</p>
          <p><strong>Department:</strong> {state.user?.department}</p>
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Authentication Test</h2>
      
      {state.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {state.error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <h3 className="text-lg font-semibold">Login</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {state.isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <hr className="my-4" />

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-3">
          <h3 className="text-lg font-semibold">Register</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'student' | 'faculty' | 'authority')}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="authority">Authority</option>
          </select>
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {state.isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthTest;