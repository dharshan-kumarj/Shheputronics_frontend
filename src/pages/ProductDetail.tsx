import React, { useState } from 'react';

// SVG Icons
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

// Sample product data
const product = {
  name: "High-Precision Digital Humidity Sensor DHT22 AM2302",
  brand: "Sheeputronics",
  rating: 4.5,
  reviews: 128,
  price: 101.00,
  originalPrice: 120.00,
  stockStatus: "In Stock",
  deliveryDate: "Tomorrow",
  description: "Professional-grade digital humidity and temperature sensor module with high accuracy and fast response time. Perfect for weather stations, smart home projects, and industrial applications.",
  features: [
    "High precision measurements with ±2% accuracy",
    "Temperature range: -40 to 80°C",
    "Humidity range: 0-100% RH",
    "Digital output with I2C interface",
    "Low power consumption",
    "Long-term stability",
    "Built-in temperature sensor"
  ],
  specifications: [
    { name: "Operating Voltage", value: "3.3V - 5V DC" },
    { name: "Current Draw", value: "2.5mA max during conversion" },
    { name: "Output", value: "Digital serial interface" },
    { name: "Temperature Range", value: "-40°C to +80°C" },
    { name: "Temperature Accuracy", value: "±0.5°C" },
    { name: "Humidity Range", value: "0-100% RH" },
    { name: "Humidity Accuracy", value: "±2% RH" },
    { name: "Resolution", value: "0.1" }
  ],
  images: Array(6).fill("/api/placeholder/600/600")
};

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-contain"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((image, index) => (
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
            {/* Title and Brand */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400">Brand: {product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {Array(5).fill(null).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-purple-400">{product.rating} out of 5</span>
              <span className="text-gray-400">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">₹{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                    <span className="text-green-500">
                      {Math.round((1 - product.price/product.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock and Delivery */}
            <div className="space-y-2">
              <p className="text-green-500">{product.stockStatus}</p>
              <p>Delivery by: {product.deliveryDate}</p>
            </div>

            {/* Quantity and Buttons */}
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

            {/* Description */}
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-medium mb-4">About this item</h2>
              <p className="text-gray-300 mb-4">{product.description}</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-medium mb-4">Technical Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
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

export default ProductDetail;