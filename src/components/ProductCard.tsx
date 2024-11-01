
// components/ProductCard.tsx
import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
            <div className="relative">
                <img 
                    src={product.thumbnail_url || "/api/placeholder/200/200"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = "/api/placeholder/200/200";
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
}