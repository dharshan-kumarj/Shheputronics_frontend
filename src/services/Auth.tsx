import axios from 'axios';
import Cookies from 'js-cookie';

// Interfaces
export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token?: string;
    user?: {
      id: string;
      username: string;
      email: string;
    };
  };
  message?: string;
  error?: string;
  statusCode?: number;
}

// Constants
const API_BASE_URL = 'https://ecommerce.portos.site';
const ENDPOINTS = {
  register: `${API_BASE_URL}/register`,
  login: `${API_BASE_URL}/login`
};

// Axios instance configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token management
export const setAuthToken = (token: string) => {
  Cookies.set('auth_token', `Bearer ${token}`, {
    expires: 7,
    secure: true,
    sameSite: 'strict'
  });
  // Set token for future axios requests
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = (): string | null => {
  return Cookies.get('auth_token') || null;
};

export const removeAuthToken = () => {
  Cookies.remove('auth_token');
  delete apiClient.defaults.headers.common['Authorization'];
};

// Register user function
export const handleUserRegistration = async (userData: RegisterUserData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post(ENDPOINTS.register, {
      username: userData.username,
      email: userData.email,
      password: userData.password
    });

    return {
      success: true,
      data: response.data,
      message: 'Registration successful'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
        statusCode: error.response?.status
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
      statusCode: 500
    };
  }
};

// Login user function
export const handleUserLogin = async (userData: LoginUserData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post(ENDPOINTS.login, {
      username: userData.username,
      password: userData.password
    });

    if (response.data?.token) {
      setAuthToken(response.data.token);
    }

    return {
      success: true,
      data: response.data,
      message: 'Login successful'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
        statusCode: error.response?.status
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
      statusCode: 500
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};