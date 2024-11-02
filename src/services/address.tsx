// types/address.ts
export interface Address {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface AddAddressPayload extends Omit<Address, 'id'> {}
export interface UpdateAddressPayload extends Partial<Address> {}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// utils/auth.ts
import Cookies from 'js-cookie';

export const getAuthToken = (): string => {
  const token = Cookies.get('auth_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('auth_token');
};

// services/api.ts
import axios, { AxiosInstance } from 'axios';
import { getAuthToken } from '../utils/auth';

const API_BASE = 'https://ecommerce.portos.site/protected';

export const createAuthenticatedApi = (): AxiosInstance => {
  const token = getAuthToken();
  
  const instance = axios.create({
    baseURL: API_BASE,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Add response interceptor for token expiration
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Redirect to login page
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// services/address.ts
import { createAuthenticatedApi } from './api';
import { isAuthenticated } from '../utils/auth';
import {
  Address,
  AddAddressPayload,
  UpdateAddressPayload,
  ApiResponse
} from '../types/address';

class AddressService {
  private api: ReturnType<typeof createAuthenticatedApi>;

  constructor() {
    this.api = createAuthenticatedApi();
  }

  /**
   * Fetch all addresses for the current user
   */
  async fetchAddresses(): Promise<ApiResponse<Address[]>> {
    try {
      if (!isAuthenticated()) {
        return {
          success: false,
          error: 'Please login to continue'
        };
      }

      const response = await this.api.get<Address[]>('/profile/addresses');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            error: 'Please login to continue'
          };
        }
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to fetch addresses'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Add a new address
   */
  async addAddress(addressData: AddAddressPayload): Promise<ApiResponse<Address>> {
    try {
      if (!isAuthenticated()) {
        return {
          success: false,
          error: 'Please login to continue'
        };
      }

      const response = await this.api.post<Address>('/profile/addresses', addressData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            error: 'Please login to continue'
          };
        }
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to add address'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Update an existing address
   */
  async updateAddress(id: number, addressData: UpdateAddressPayload): Promise<ApiResponse<Address>> {
    try {
      if (!isAuthenticated()) {
        return {
          success: false,
          error: 'Please login to continue'
        };
      }

      const response = await this.api.put<Address>(`/profile/address/${id}`, addressData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            error: 'Please login to continue'
          };
        }
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to update address'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Delete an address
   */
  async deleteAddress(id: number): Promise<ApiResponse<void>> {
    try {
      if (!isAuthenticated()) {
        return {
          success: false,
          error: 'Please login to continue'
        };
      }

      await this.api.delete(`/profile/address/${id}`);
      
      return {
        success: true
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            error: 'Please login to continue'
          };
        }
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to delete address'
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Set an address as default
   */
  async setDefaultAddress(id: number): Promise<ApiResponse<Address>> {
    return this.updateAddress(id, { isDefault: true });
  }

  /**
   * Validate address payload before sending to server
   */
  validateAddressPayload(payload: AddAddressPayload): { valid: boolean; error?: string } {
    if (!payload.name?.trim()) {
      return { valid: false, error: 'Name is required' };
    }
    if (!payload.address?.trim()) {
      return { valid: false, error: 'Address is required' };
    }
    if (!payload.city?.trim()) {
      return { valid: false, error: 'City is required' };
    }
    if (!payload.state?.trim()) {
      return { valid: false, error: 'State is required' };
    }
    if (!payload.pincode?.trim() || !/^\d{6}$/.test(payload.pincode)) {
      return { valid: false, error: 'Valid 6-digit pincode is required' };
    }
    if (!payload.phone?.trim() || !/^\d{10}$/.test(payload.phone)) {
      return { valid: false, error: 'Valid 10-digit phone number is required' };
    }
    return { valid: true };
  }
}

// Create and export singleton instance
export const addressService = new AddressService();

// Export type definitions
export type { Address, AddAddressPayload, UpdateAddressPayload, ApiResponse };

// Example usage:
/*
import { addressService } from './services/address';

// Fetch addresses
const getAddresses = async () => {
  const response = await addressService.fetchAddresses();
  if (response.success) {
    // Handle addresses
    console.log(response.data);
  } else {
    // Handle error
    console.error(response.error);
  }
};

// Add new address
const addNewAddress = async () => {
  const newAddress = {
    name: "John Doe",
    address: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "9876543210",
    isDefault: false
  };

  // Validate before sending
  const validation = addressService.validateAddressPayload(newAddress);
  if (!validation.valid) {
    console.error(validation.error);
    return;
  }

  const response = await addressService.addAddress(newAddress);
  if (response.success) {
    // Handle success
    console.log('Address added:', response.data);
  } else {
    // Handle error
    console.error(response.error);
  }
};
*/