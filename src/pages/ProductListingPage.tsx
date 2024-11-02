// pages/ProductListingPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, Star, Package, Loader, ChevronRight } from 'lucide-react';
import { fetchAllProducts } from '../services/Products';
import Navbar from '../components/Navbar';

export default function ProductListingPage() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const searchQuery = searchParams.get('search') || '';

    const loadProducts = async (isNewSearch: boolean = false) => {
        if (loading) return;

        setLoading(true);

        try {
            const currentPage = isNewSearch ? 1 : page;

            const response = await fetchAllProducts({
                name: searchQuery,
                page: currentPage,
                limit: 10
            });

            if (response.success) {
                if (!response.data || response.data.length === 0) {
                    setHasMore(false);
                    if (isNewSearch) {
                        setProducts([]);
                    }
                } else {
                    setProducts(prev =>
                        isNewSearch ? response.data : [...prev, ...response.data]
                    );
                    setHasMore(response.data.length === 10);
                }
            } else {
                setError(response.error || 'Failed to fetch products');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setProducts([]);
        loadProducts(true);
    }, [searchQuery]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
        loadProducts();
    };

    const renderRatingStars = (rating: number) => (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={`${star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400'
                        }`}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            
            {/* Hero Section */}
            <div className="px-12 py-8 border-b border-gray-800">
                <div className="max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">
                        {searchQuery 
                            ? <span>Search Results for <span className="text-purple-500">"{searchQuery}"</span></span>
                            : <span>Browse Our <span className="text-purple-500">Electronic Components</span></span>
                        }
                    </h1>
                    <p className="text-gray-400">
                        {products.length} products found for your search
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-12 py-8">
                {/* Product Grid */}
                <div className="space-y-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 backdrop-blur-sm 
                                cursor-pointer transition-all duration-300"
                            onClick={() => window.location.href = `/product/${product.id}`}
                        >
                            <div className="flex h-56">
                                {/* Image Section */}
                                <div className="w-1/3 relative">
                                    {product.thumbnail_url ? (
                                        <div className="relative h-full">
                                            <img
                                                src={product.thumbnail_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
                                            <Package size={32} className="text-gray-500" />
                                        </div>
                                    )}
                                    <button
                                        className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-full
                                            border border-gray-700/50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Heart size={20} className="text-gray-300" />
                                    </button>
                                </div>

                                {/* Details Section */}
                                <div className="w-2/3 p-8 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-medium text-white mb-2">
                                                {product.name}
                                            </h2>
                                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                <span>SKU: {product.sku}</span>
                                                <span>•</span>
                                                <span>Sold by {product.seller.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-purple-500">
                                                ₹{product.price.toFixed(2)}
                                            </div>
                                            <div className={`mt-1 px-3 py-1 rounded-full text-xs
                                                ${product.stock > 0 
                                                    ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                                                    : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm flex-grow mb-4 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center space-x-2">
                                            {renderRatingStars(product.avg_rating)}
                                            <span className="text-gray-400 text-sm">
                                                ({product.total_ratings})
                                            </span>
                                        </div>
                                        <div className="flex items-center text-purple-500 text-sm">
                                            View Details <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && products.length > 0 && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full
                                flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors duration-300"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Load More Products</span>
                            )}
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mb-4" />
                        <p className="text-gray-400">Loading products...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-2xl mx-auto mt-8 px-6 py-4 bg-red-900/20 border border-red-900/50 
                        rounded-lg text-center text-red-400">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Package size={48} className="text-gray-600 mb-4" />
                        <p className="text-gray-400 text-xl mb-2">No products found</p>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                )}

                {/* End of Results */}
                {!hasMore && products.length > 0 && (
                    <div className="text-gray-400 text-center py-8 border-t border-gray-800 mt-12">
                        You've reached the end of the list
                    </div>
                )}
            </div>
        </div>
    );
}