import axios from 'axios';

// Interfaces for API requests
interface RegisterUserData {
 username: string;
 email: string;
 password: string;
}

interface LoginUserData {
 username: string;
 password: string;
}

// Base API URL 
const API_BASE_URL = 'https://ecommerce.portos.site';

// API endpoints
const ENDPOINTS = {
 register: `${API_BASE_URL}/register`,
 login: `${API_BASE_URL}/login`
};

// Axios instance with default config
const apiClient = axios.create({
 baseURL: API_BASE_URL,
 headers: {
   'Content-Type': 'application/json'
 }
});

// Register user function
const handleUserRegistration = async (userData: RegisterUserData) => {
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
const handleUserLogin = async (userData: LoginUserData) => {
 try {
   const response = await apiClient.post(ENDPOINTS.login, {
     username: userData.username,
     password: userData.password
   });

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

export { 
 handleUserRegistration, 
 handleUserLogin 
};