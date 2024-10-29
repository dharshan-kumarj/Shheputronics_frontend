// src/pages/ProductDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, ProductDetail } from '../../api/Products';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const result = await fetchProductById(Number(id));
        
        if (result.success && result.data) {
          setProduct(result.data);
        } else {
          setError(result.error || 'Failed to load product');
        }
      } catch (err) {
        setError('Something went wrong!');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
      </div>
    );
  }

  if (!product) {
    return <div className="flex justify-center items-center min-h-screen">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Product Header */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-semibold">${product.price}</p>
        </div>

        {/* Product Image */}
        <div className="p-6 border-t">
          <img 
            src={product.thumbnail_url} 
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Seller Information */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold mb-4">Seller Information</h2>
          <div className="space-y-2">
            <p>Name: {product.seller.name}</p>
            <p>Rating: {product.seller.rating}/5</p>
            <p>Total Sales: {product.seller.total_sales}</p>
          </div>
        </div>

        {/* Product Attributes */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            {product.attributes.map((attr, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium">{attr.name}:</span>
                <span>{attr.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {product.recent_reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">Rating: {review.rating}/5</span>
                    {review.is_verified && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;