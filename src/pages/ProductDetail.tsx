// pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/Products';
import { toast } from 'react-hot-toast';
import { Star, Share2, Loader, ChevronLeft } from 'lucide-react';

import Cookies from 'js-cookie';
interface ProductAttribute {
  name: string;
  value: string;
}

interface ProductSpecification {
  name: string;
  value: string;
}

interface ProductData {
  id: number;
  name: string;
  brand: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  stockStatus: string;
  deliveryDate: string;
  description: string;
  features: string[];
  specifications: ProductSpecification[];
  thumbnail_url: string;
  attributes?: ProductAttribute[];
  stock: number;
}

interface CheckoutItem {
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  maxQuantity: number;
}


interface Review {
  id: number;
  user_id: number;
  product_id: number;
  order_id: number;
  rating: number;
  comment: string;
  date: string;
  is_verified: boolean;
}

interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface ReviewSummary {
  avg_rating: number;
  total_reviews: number;
  rating_distribution: RatingDistribution;
  updated_at: string;
}

interface ProductData {
  // ... existing fields ...
  review_summary: ReviewSummary;
  recent_reviews: Review[];
}

// Add this new component for the reviews section
const ReviewsSection: React.FC<{ reviews: Review[], summary: ReviewSummary }> = ({ reviews, summary }) => {
  return (
    <div className="mt-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews & Ratings</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Rating Summary Card - Left Side */}
          <div className="md:col-span-4 bg-gray-800 rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-white mb-2">
                {summary.avg_rating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= summary.avg_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                  />
                ))}
              </div>
              <div className="text-gray-400">
                Based on {summary.total_reviews} reviews
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = summary.rating_distribution[rating as keyof RatingDistribution];
                const percentage = (count / summary.total_reviews) * 100 || 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="text-sm text-gray-400 w-6">{rating}★</div>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-400 w-12">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List - Right Side */}
          <div className="md:col-span-8">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                          <span className="text-lg font-semibold">
                            {review.user_id.toString()[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">User {review.user_id}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(review.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      {review.is_verified && (
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                        />
                      ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <div className="text-gray-400 mb-2">No reviews yet</div>
                <p className="text-sm text-gray-500">Be the first to review this product</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const token = Cookies.get('auth_token');

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`https://ecommerce.portos.site/product/${id}`);
        if (!response.ok) {
          throw new Error('Failed to load product');
        }
        const data = await response.json();
        setProductData(data);
      } catch (err) {
        setError('An error occurred while loading the product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleShare = async (platform: string) => {
    if (!productData) return;

    const shareUrl = window.location.href;
    const shareText = `Check out ${productData.name} on our store!`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'instagram':
        toast.success('Tip: Screenshot and share on Instagram!', {
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        });
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!', {
            duration: 2000,
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          });
        } catch (err) {
          toast.error('Failed to copy link');
        }
        break;
    }
    setShowShareMenu(false);
  };

  const handleBuyNow = () => {
    if (!productData) return;

    try {
      const checkoutItems: CheckoutItem[] = [{
        product_id: productData.id,
        quantity: quantity,
        name: productData.name,
        price: productData.price,
        image: productData.thumbnail_url,
        maxQuantity: productData.stock
      }];

      const encodedItems = encodeURIComponent(JSON.stringify(checkoutItems));
      navigate(`/checkout?items=${encodedItems}`);
    } catch (err) {
      toast.error('Failed to process checkout. Please try again.');
    }
  };

  const handleAddToCart = async () => {
    if (!productData || !id) return;

    setIsAddingToCart(true);
    try {
      const response = await fetch('https://ecommerce.portos.site/protected/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: parseInt(id),
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      toast.success('Added to cart successfully!', {
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
        },
      });
    } catch (error) {
      toast.error('Failed to add to cart', {
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
        },
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-lg">{error || 'Product not found'}</div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  const productImages = productData.full_image_urls || [productData.thumbnail_url];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={productData.name}
                className="w-full aspect-square object-contain"
              />
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden ${selectedImage === index
                        ? 'ring-2 ring-purple-500'
                        : 'hover:ring-2 hover:ring-purple-400'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${productData.name} - View ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
              {productData.seller && (
                <p className="text-gray-400">Seller: {productData.seller.name}</p>
              )}
            </div>

            {/* Rating Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= productData.avg_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-purple-400">{productData.avg_rating} out of 5</span>
              <span className="text-gray-400">({productData.total_ratings} ratings)</span>
            </div>

            {/* Price Section */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">₹{productData.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="space-y-2">
              <p className={productData.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                {productData.stock > 0 ? `${productData.stock} units in stock` : 'Out of stock'}
              </p>
              <p className="text-gray-400">SKU: {productData.sku}</p>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-400">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {[...Array(Math.min(10, productData.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || productData.stock === 0}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isAddingToCart ? (
                    <span className="flex items-center justify-center">
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Adding to Cart...
                    </span>
                  ) : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={productData.stock === 0}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Buy Now
                </button>

                {/* Share Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <>
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center"
                        >
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('instagram')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center"
                        >
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                          Instagram
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center"
                        >
                          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          Twitter
                        </button>
                        <hr className="my-2 border-gray-700" />
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center"
                        >
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy Link
                        </button>
                      </div>
                      {/* Clicking outside closes the menu */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowShareMenu(false)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-medium mb-4">About this item</h2>
              <p className="text-gray-300 mb-4">{productData.description}</p>
            </div>

            {/* Product Attributes */}
            {productData.attributes && productData.attributes.length > 0 && (
              <div className="border-t border-gray-800 pt-6">
                <h2 className="text-xl font-medium mb-4">Additional Information</h2>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <tbody>
                      {productData.attributes.map((attr, index) => (
                        <tr key={index} className="border-b border-gray-700 last:border-0">
                          <td className="px-4 py-2 text-gray-400">{attr.name}</td>
                          <td className="px-4 py-2">{attr.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {productData.review_summary && (
          <ReviewsSection
            reviews={productData.recent_reviews || []}
            summary={productData.review_summary}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;