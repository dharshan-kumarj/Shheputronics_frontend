// src/api/cart.ts

import axios from 'axios';
import Cookies from 'js-cookie';

// Interfaces
interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    thumbnail_url: string;
  };
}

interface CartResponse {
  success: boolean;
  data?: {
    items: CartItem[];
    total_items: number;
    total_amount: number;
  };
  error?: string;
  statusCode?: number;
}

// API config
const API_BASE_URL = 'https://ecommerce.portos.site';
const ENDPOINTS = {
  cart: `${API_BASE_URL}/protected/cart/add`
};

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  console.log("Current token:", token);

  if (token && config.headers) {
    config.headers.Authorization = token;
    console.log("Authorization header:", config.headers.Authorization);
  } else {
    console.log("No token found or headers undefined");
  }
  return config;
}, (error) => {
  console.log("Interceptor error:", error);
  return Promise.reject(error);
});

// Fetch cart items
const getCart = async (): Promise<CartResponse> => {
  try {
    console.log("Making request to:", ENDPOINTS.cart);

    const response = await apiClient.get(ENDPOINTS.cart);
    console.log("Response received:", response.data);

    return {
      success: true,
      data: response.data,
      statusCode: response.status
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error response:", error.response);

      if (error.response?.status === 401) {
        console.log("Unauthorized access, clearing token");
        Cookies.remove('token');
        window.location.href = '/login';
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch cart',
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
  getCart,
  type CartItem,
  type CartResponse
};