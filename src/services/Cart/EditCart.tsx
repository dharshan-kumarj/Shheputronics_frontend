// src/api/addToCart.ts

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

interface AddToCartData {
 product_id: number;
 quantity: number;
}

interface AddToCartResponse {
 success: boolean;
 data?: CartItem;
 error?: string;
 statusCode?: number;
}

interface UpdateCartData {
    quantity: number;
}

interface DeleteCartResponse {
    success: boolean;
    message?: string;
    error?: string;
    statusCode?: number;
 }
  


// API config
const API_BASE_URL = 'https://ecommerce.portos.site';
const ENDPOINTS = {
    addToCart: `${API_BASE_URL}/protected/cart/add`,
    updateCart: (id: number) => `${API_BASE_URL}/protected/cart/item/${id}`,
    deleteCart: (id: number) => `${API_BASE_URL}/protected/cart/item/${id}`  // Add this line
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

// Add to cart function
const addToCart = async (cartData: AddToCartData): Promise<AddToCartResponse> => {
 try {
   console.log("Making add to cart request to:", ENDPOINTS.addToCart);
   console.log("Request data:", cartData);

   const response = await apiClient.post(ENDPOINTS.addToCart, cartData);
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
       error: error.response?.data?.message || 'Failed to add to cart',
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

const updateCart = async (cartItemId: number, updateData: UpdateCartData): Promise<AddToCartResponse> => {
    try {
      console.log("Making update cart request to:", ENDPOINTS.updateCart(cartItemId));
      console.log("Request data:", updateData);
  
      const response = await apiClient.put(ENDPOINTS.updateCart(cartItemId), updateData);
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
  
        if (error.response?.status === 404) {
          return {
            success: false,
            error: 'Cart item not found',
            statusCode: 404
          };
        }
  
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to update cart',
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

// Add the delete cart function
const deleteCart = async (cartItemId: number): Promise<DeleteCartResponse> => {
    try {
      console.log("Making delete cart request to:", ENDPOINTS.deleteCart(cartItemId));
      console.log("Cart Item ID:", cartItemId);
  
      const response = await apiClient.delete(ENDPOINTS.deleteCart(cartItemId));
      console.log("Response received:", response.data);
  
      return {
        success: true,
        message: 'Cart item deleted successfully',
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
  
        if (error.response?.status === 404) {
          console.log("Cart item not found:", cartItemId);
          return {
            success: false,
            error: 'Cart item not found',
            statusCode: 404
          };
        }
  
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to delete cart item',
          statusCode: error.response?.status
        };
      }
  
      console.log("Unexpected error:", error);
      return {
        success: false,
        error: 'An unexpected error occurred',
        statusCode: 500
      };
    }
  };

// Update your exports
export {
    addToCart,
    updateCart,
    deleteCart,  // Add this
    type CartItem,
    type AddToCartData,
    type AddToCartResponse,
    type UpdateCartData,
    type DeleteCartResponse  // Add this
  };