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
  cart: `${API_BASE_URL}/protected/cart`
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

// Helper function to validate cart item structure
const validateCartItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item.id === 'number' &&
    typeof item.product_id === 'number' &&
    typeof item.quantity === 'number' &&
    item.product &&
    typeof item.product.name === 'string' &&
    typeof item.product.price === 'number' &&
    typeof item.product.thumbnail_url === 'string'
  );
};

// Fetch cart items
const getCart = async (): Promise<CartResponse> => {
  try {
    console.log("Making request to:", ENDPOINTS.cart);
    

    const response = await apiClient.get(ENDPOINTS.cart);
    console.log("Raw API response:", response.data);

    // Validate response structure
    if (!response.data || !Array.isArray(response.data.items)) {
      console.error("Invalid response structure:", response.data);
      throw new Error('Invalid response structure');
    }

    // Validate each cart item
    const validItems = response.data.items.map((item: any) => {
      if (!validateCartItem(item)) {
        console.error("Invalid cart item structure:", item);
        // Provide default values or throw error based on your requirements
        return {
          id: item.id || 0,
          product_id: item.product_id || 0,
          quantity: item.quantity || 0,
          product: {
            name: item.product?.name || 'Product Not Found',
            price: item.product?.price || 0,
            thumbnail_url: item.product?.thumbnail_url || '/placeholder.jpg'
          }
        };
      }
      return item;
    });

    return {
      success: true,
      data: {
        items: validItems,
        total_items: response.data.total_items || validItems.length,
        total_amount: response.data.total_amount || 0
      },
      statusCode: response.status
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

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

    console.error("Unexpected error:", error);
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