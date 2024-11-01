import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircuitBoard } from 'lucide-react';
import { 
  handleUserLogin, 
  handleUserRegistration, 
  LoginUserData, 
  RegisterUserData 
} from '../services/Auth';

interface FormData extends RegisterUserData {
  confirmPassword?: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setError('');
    setSuccessMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (activeTab === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { confirmPassword, ...registerData } = formData;
        const result = await handleUserRegistration(registerData);

        if (result.success) {
          setSuccessMessage('Registration successful! Please login with your credentials.');
          resetForm();
          setTimeout(() => setActiveTab('login'), 2000);
        } else {
          throw new Error(result.error);
        }
      } else {
        const loginData: LoginUserData = {
          username: formData.username,
          password: formData.password
        };
        
        const result = await handleUserLogin(loginData);

        if (result.success) {
          setSuccessMessage('Login successful! Redirecting...');
          setTimeout(() => navigate('/'), 1000);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="flex items-center justify-center space-x-2">
          <CircuitBoard className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-white">Sheeputronics</h1>
        </div>
        
        {/* Auth Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-center text-white mb-6">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'login'
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('login');
                  resetForm();
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'register'
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('register');
                  resetForm();
                }}
              >
                Register
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded text-green-200 text-sm">
                {successMessage}
              </div>
            )}

            {/* Forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                {activeTab === 'register' && (
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                )}
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                {activeTab === 'register' && (
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? (activeTab === 'login' ? "Signing in..." : "Creating Account...") 
                  : (activeTab === 'login' ? "Sign In" : "Create Account")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;