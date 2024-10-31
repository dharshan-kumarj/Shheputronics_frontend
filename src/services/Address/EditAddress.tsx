// src/api/addressCreate.ts

import axios from 'axios';
import Cookies from 'js-cookie';

// Interfaces
interface CreateAddressData {
  phone: number;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface UpdateAddressData {
  phone: number;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface AddressResponse {
  success: boolean;
  data?: CreateAddressData | UpdateAddressData;
  error?: string;
  statusCode?: number;
}

interface DeleteAddressResponse {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

// API config
const API_BASE_URL = 'https://ecommerce.portos.site';
const ENDPOINTS = {
  createAddress: `${API_BASE_URL}/protected/profile/addresses`,
  updateAddress: (id: number) => `${API_BASE_URL}/protected/profile/addresses/${id}`,
  deleteAddress: (id: number) => `${API_BASE_URL}/protected/profile/addresses/${id}`
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

// Create new address
const createAddress = async (addressData: CreateAddressData): Promise<AddressResponse> => {
  try {
    console.log("Making create request to:", ENDPOINTS.createAddress);
    console.log("Request data:", addressData);

    const response = await apiClient.post(ENDPOINTS.createAddress, addressData);
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
        error: error.response?.data?.message || 'Failed to create address',
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

// Update existing address
const updateAddress = async (id: number, addressData: UpdateAddressData): Promise<AddressResponse> => {
  try {
    console.log("Making update request to:", ENDPOINTS.updateAddress(id));
    console.log("Request data:", addressData);

    const response = await apiClient.put(ENDPOINTS.updateAddress(id), addressData);
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
          error: 'Address not found',
          statusCode: 404
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update address',
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

// Delete address
const deleteAddress = async (id: number): Promise<DeleteAddressResponse> => {
  try {
    console.log("Making delete request to:", ENDPOINTS.deleteAddress(id));

    const response = await apiClient.delete(ENDPOINTS.deleteAddress(id));
    console.log("Response received:", response.data);

    return {
      success: true,
      message: 'Address deleted successfully',
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
          error: 'Address not found',
          statusCode: 404
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete address',
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
  createAddress,
  updateAddress,
  deleteAddress,
  type CreateAddressData,
  type UpdateAddressData,
  type AddressResponse,
  type DeleteAddressResponse
};