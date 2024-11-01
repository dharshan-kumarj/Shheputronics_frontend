import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/Products';

// Keep your original SVG components
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetchProductById(parseInt(id));
        
        if (response.success && response.data) {
          setProductData(response.data);
        } else {
          setError(response.error || 'Failed to load product');
        }
      } catch (err) {
        setError('An error occurred while loading the product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-red-500">{error || 'Product not found'}</div>
      </div>
    );
  }

  const { 
    name,
    brand,
    rating,
    reviews,
    price,
    originalPrice,
    stockStatus,
    deliveryDate,
    description,
    features,
    specifications,
    thumbnail_url
  } = productData;

  // Use placeholder images until API provides multiple images
  const productImages = Array(6).fill(thumbnail_url || "/api/placeholder/600/600");

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={productImages[selectedImage]}
                alt={name}
                className="w-full aspect-square object-contain"
              />
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <img 
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{name}</h1>
              <p className="text-gray-400">Brand: {brand}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {Array(5).fill(null).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-purple-400">{rating} out of 5</span>
              <span className="text-gray-400">({reviews} reviews)</span>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">₹{price.toFixed(2)}</span>
                {originalPrice && (
                  <>
                    <span className="text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
                    <span className="text-green-500">
                      {Math.round((1 - price/originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-green-500">{stockStatus}</p>
              <p>Delivery by: {deliveryDate}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm">Quantity:</label>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-gray-800 rounded px-2 py-1 border border-gray-700"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
                  Add to Cart
                </button>
                <button className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700">
                  Buy Now
                </button>
                <button className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800">
                  <HeartIcon />
                </button>
                <button className="p-3 border border-gray-700 rounded-lg hover:bg-gray-800">
                  <ShareIcon />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-medium mb-4">About this item</h2>
              <p className="text-gray-300 mb-4">{description}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-medium mb-4">Technical Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {specifications?.map((spec, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-gray-400">{spec.name}:</span>
                    <span className="ml-2">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;