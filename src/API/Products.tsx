// src/api/products.ts

import axios from 'axios';

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

// API configuration
const API_BASE_URL = 'https://ecommerce.portos.site';

const ENDPOINTS = {
 products: `${API_BASE_URL}/products`,
 productById: (id: number) => `${API_BASE_URL}/product/${id}`
};

// Axios client instance
const apiClient = axios.create({
 baseURL: API_BASE_URL,
 headers: {
   'Content-Type': 'application/json'
 }
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

export {
 fetchAllProducts,
 fetchProductById,
 type ProductDetail,
 type ProductQueryParams,
 type Review,
 type Attribute,
 type Seller
};