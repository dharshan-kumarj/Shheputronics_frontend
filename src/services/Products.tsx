
import axios from 'axios';
import Cookies from 'js-cookie';

// Interfaces for API
interface ProductQueryParams {
  name?: string;
  min_price?: number;
  max_price?: number;
  avg_rating?: number;
  categories?: number[];
  attributes?: {
    color?: string;
    memory?: string;
  };
  in_stock?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface Seller {
  id: number;
  name: string;
  rating: number;
  total_sales: number;
}

interface Attribute {
  name: string;
  value: string;
}

interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  is_verified: boolean;
}

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  seller: Seller;
  categories: number[];
  thumbnail_url: string;
  attributes: Attribute[];
  recent_reviews: Review[];
}

interface ProductReviewData {
  order_id: number;
  product_id: number;
  rating: number;
  comment: string;
}

interface ProductReviewResponse {
  success: boolean;
  data?: Review;
  error?: string;
  statusCode?: number;
}

// API configuration
const API_BASE_URL = 'https://ecommerce.portos.site';

const ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  productById: (id: number) => `${API_BASE_URL}/product/${id}`,
  productReview: `${API_BASE_URL}/protected/product/review`
};

// Axios client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests for protected endpoints
apiClient.interceptors.request.use((config) => {
  if (config.url?.includes('/protected/')) {
    const token = Cookies.get('token');
    if (token && config.headers) {
      config.headers.Authorization = token;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API functions
const fetchAllProducts = async (params: ProductQueryParams) => {
  try {
    const response = await apiClient.get(ENDPOINTS.products, {
      params: {
        name: params.name,
        min_price: params.min_price,
        max_price: params.max_price,
        avg_rating: params.avg_rating,
        categories: params.categories,
        attributes: params.attributes,
        in_stock: params.in_stock,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
        page: params.page || 1,
        limit: params.limit || 10
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Products fetched successfully'
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products',
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

const fetchProductById = async (productId: number): Promise<{
  success: boolean;
  data?: ProductDetail;
  error?: string;
  statusCode?: number;
}> => {
  try {
    const response = await apiClient.get(ENDPOINTS.productById(productId));
    
    return {
      success: true,
      data: response.data,
      statusCode: response.status
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product details',
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

const productReview = async (reviewData: ProductReviewData): Promise<ProductReviewResponse> => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
        statusCode: 401
      };
    }

    const response = await apiClient.post(ENDPOINTS.productReview, reviewData);

    return {
      success: true,
      data: response.data,
      statusCode: response.status
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        Cookies.remove('token');
        window.location.href = '/login';
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit review',
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
  fetchAllProducts,
  fetchProductById,
  productReview,
  type ProductDetail,
  type ProductQueryParams,
  type Review,
  type Attribute,
  type Seller,
  type ProductReviewData,
  type ProductReviewResponse
};