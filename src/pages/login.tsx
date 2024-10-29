// src/pages/Register.tsx

import React, { useState } from 'react';
import { handleUserRegistration, handleUserLogin } from '../api/auth';

const Register: React.FC = () => {
  // Register form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Handle Register form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Register submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const result = await handleUserRegistration(formData);
      
      if (result.success) {
        setMessage('Registration successful!');
        setFormData({ username: '', email: '', password: '' });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const result = await handleUserLogin(loginData);
      
      if (result.success) {
        setMessage('Login successful!');
        setLoginData({ username: '', password: '' });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center gap-8">
      {/* Register Form */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Login
          </button>
        </form>
      </div>

      {/* Messages */}
      {message && (
        <div className="fixed top-4 right-4 p-4 bg-green-100 text-green-700 rounded shadow-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 p-4 bg-red-100 text-red-700 rounded shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Register;