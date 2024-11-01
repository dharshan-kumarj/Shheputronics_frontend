// API Request Format
interface FilterRequest {
    category?: string;    // The category to filter by
    page: number;         // Page number for pagination
    limit: number;        // Number of items per page
}

// API Response Format
interface FilterResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    avg_rating: number;
    total_ratings: number;
    thumbnail_url: string;
    category: string;
}