// pages/CategoriesPage.tsx
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

// Define the filter request interface to match backend
interface ProductFilterRequest {
    name?: string;
    min_price?: number;
    max_price?: number;
    avg_rating?: number;
    categories?: number[];
    attributes?: Record<string, any>;
    in_stock?: boolean;
    sort_by?: string;
    sort_order?: string;
    page: number;
    limit: number;
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
}

const categoryMap = {
    "/suggested": [],
    "/sensors": [1],
    "/transistors": [2],
    "/connectors": [3],
    "/rectifiers": [4],
    "/diodes": [5],
    "/displays": [6],
    "/cables": [7]
} as const;

const filterCategories = Object.keys(categoryMap);

const banners = [
    {
        id: 1,
        image: "/api/placeholder/1200/300",
        title: "New Arrivals",
        description: "Check out our latest electronic components"
    },
    {
        id: 2,
        image: "/api/placeholder/1200/300",
        title: "Special Offers",
        description: "Get up to 30% off on selected items"
    },
    {
        id: 3,
        image: "/api/placeholder/1200/300",
        title: "Featured Products",
        description: "Discover our most popular components"
    }
];

const CategoriesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("/suggested");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [sortOrder, setSortOrder] = useState('asc');
    const [inStock, setInStock] = useState<boolean>(true);

    // Carousel Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchProducts = async (filterParams?: Partial<ProductFilterRequest>) => {
      setLoading(true);
      setError(null);
  
      try {
          const defaultParams: ProductFilterRequest = {
              page: 1,
              limit: 10,
              sort_by: "price",
              sort_order: sortOrder,
              in_stock: inStock,
              categories: categoryMap[selectedCategory as keyof typeof categoryMap]
          };
  
          const filterRequest = {
              ...defaultParams,
              ...filterParams,
          };
  
          // Convert filterRequest to URL query parameters
          const queryParams = new URLSearchParams();
          Object.entries(filterRequest).forEach(([key, value]) => {
              if (value !== undefined) {
                  if (Array.isArray(value)) {
                      value.forEach((v) => queryParams.append(`${key}[]`, String(v)));
                  } else {
                      queryParams.append(key, String(value));
                  }
              }
          });
  
          const response = await fetch(`https://ecommerce.portos.site/products?${queryParams.toString()}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : []);
  
      } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
          console.error('Error fetching products:', err);
      } finally {
          setLoading(false);
      }
  };
  
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortOrder, inStock]);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    const applyPriceFilter = () => {
        fetchProducts({
            min_price: priceRange.min,
            max_price: priceRange.max
        });
    };

    const handleSortChange = (order: string) => {
        setSortOrder(order);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
            <div className="relative">
                <img 
                    src={product.thumbnail_url || "/api/placeholder/200/200"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/200/200";
                    }}
                />
                <button className="absolute top-2 right-2 p-1 bg-gray-900/50 rounded-full">
                    <Heart className="w-4 h-4" />
                </button>
            </div>
            <h3 className="text-white text-sm font-medium mb-1">{product.name}</h3>
            <p className="text-gray-400 text-xs mb-2 flex-grow line-clamp-2">
                {product.description || 'No description available'}
            </p>
            <div className="flex items-center mb-2">
                <div className="flex items-center">
                    {Array(5).fill(null).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3 h-3 ${
                                i < Math.floor(product.avg_rating || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-600'
                            }`}
                        />
                    ))}
                </div>
                <span className="text-gray-400 text-xs ml-2">
                    ({product.total_ratings || 0})
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-xs text-gray-400">From</span>
                    <span className="text-white ml-1">
                        ₹{(product.price || 0).toFixed(2)}
                    </span>
                </div>
                {product.stock > 0 ? (
                    <span className="text-xs text-green-400">In Stock</span>
                ) : (
                    <span className="text-xs text-red-400">Out of Stock</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div className="flex items-center space-x-8">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
                        <span className="text-sm font-medium">/ sheeputronics</span>
                    </div>
                    <div className="space-x-6 text-sm">
                        <button className="text-white">Explore</button>
                        <button className="text-gray-400">Categories</button>
                        <button className="text-gray-400">Support</button>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Heart className="w-5 h-5 text-gray-400" />
                    <ShoppingCart className="w-5 h-5 text-gray-400" />
                </div>
            </nav>

            {/* Carousel */}
            <div className="relative w-full overflow-hidden h-[300px] mb-8">
                <div 
                    className="flex transition-transform duration-500 ease-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {banners.map((banner) => (
                        <div key={banner.id} className="w-full flex-shrink-0 relative">
                            <img 
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                                    <p className="text-gray-200">{banner.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel Controls */}
                <button 
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Category Filters */}
            <div className="px-6 py-4 flex space-x-2 overflow-x-auto scrollbar-hide">
                {filterCategories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                        className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors
                            ${selectedCategory === category 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        {category.replace('/', '')}
                    </button>
                ))}
            </div>

            {/* Filter Controls */}
            <div className="px-6 py-4 flex flex-wrap gap-4">
                <select 
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded"
                >
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>

                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({
                            ...prev,
                            min: Number(e.target.value)
                        }))}
                        className="bg-gray-800 text-white p-2 rounded w-24"
                        placeholder="Min Price"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({
                            ...prev,
                            max: Number(e.target.value)
                        }))}
                        className="bg-gray-800 text-white p-2 rounded w-24"
                        placeholder="Max Price"
                    />
                    <button
                        onClick={applyPriceFilter}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Apply
                    </button>
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="form-checkbox bg-gray-800"
                    />
                    In Stock Only
                </label>
            </div>

            {/* Products Grid */}
            <div className="px-6 py-4">
                <h2 className="text-xl font-medium mb-6">
                    {selectedCategory.replace('/', '')} 
                    {loading && <span className="ml-2 text-gray-400">(Loading...)</span>}
                </h2>

                {error && (
                    <div className="text-red-500 mb-4 p-4 bg-red-900/20 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-400 py-12">
                                No products found
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CategoriesPage;