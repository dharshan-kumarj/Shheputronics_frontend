
import axios from 'axios';
import Cookies from 'js-cookie';

// Interfaces
interface OrderItem {
  product_id: number;
  quantity: number;
}

interface PlaceOrderData {
  address_id: number;
  items: OrderItem[];
}

interface OrderResponse {
  success: boolean;
  data?: {
    order_id?: number;
    message?: string;
  };
  error?: string;
  statusCode?: number;
}

// API config
const API_BASE_URL = 'https://ecommerce.portos.site';
const ENDPOINTS = {
  placeOrder: `${API_BASE_URL}/protected/orders`
};

// Axios instance with auth interceptor
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

// Place order function
const placeOrder = async (orderData: PlaceOrderData): Promise<OrderResponse> => {
  try {
    console.log("Making order request to:", ENDPOINTS.placeOrder);
    console.log("Order data:", orderData);

    const response = await apiClient.post(ENDPOINTS.placeOrder, orderData);
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
        error: error.response?.data?.message || 'Failed to place order',
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
  placeOrder,
  type PlaceOrderData,
  type OrderItem,
  type OrderResponse
};