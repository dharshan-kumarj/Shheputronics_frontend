import axios from 'axios';
import Cookies from 'js-cookie';

// Interfaces
interface Address {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

interface AddressListResponse {
  success: boolean;
  data?: Address[];
  error?: string;
  statusCode?: number;
}

interface AddressSingleResponse {
  success: boolean;
  data?: Address;
  error?: string;
  statusCode?: number;
}

// API config
const API_BASE_URL = 'https://ecommerce.portos.site';
const ENDPOINTS = {
  addresses: `${API_BASE_URL}/protected/profile/addresses`,
  addressById: (id: number) => `${API_BASE_URL}/protected/profile/addresses/${id}`
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

// Fetch all addresses
const fetchAllAddresses = async (): Promise<AddressListResponse> => {
  try {
    console.log("Making request to:", ENDPOINTS.addresses);

    const response = await apiClient.get(ENDPOINTS.addresses);
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
        error: error.response?.data?.message || 'Failed to fetch addresses',
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

// Fetch single address by ID
const fetchAddressById = async (addressId: number): Promise<AddressSingleResponse> => {
  try {
    console.log("Making request to:", ENDPOINTS.addressById(addressId));

    const response = await apiClient.get(ENDPOINTS.addressById(addressId));
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
        error: error.response?.data?.message || 'Failed to fetch address',
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

// Helper function to check token (for debugging)
const checkAuthToken = () => {
  const token = Cookies.get('token');
  console.log('Current auth token:', token);
  return token;
};

export {
  fetchAllAddresses,
  fetchAddressById,
  checkAuthToken,
  type Address,
  type AddressListResponse,
  type AddressSingleResponse
};