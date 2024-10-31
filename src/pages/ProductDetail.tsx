import React, { useState } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCcw,
  ChevronDown
} from 'lucide-react';

// Sample product data
const product = {
  name: "High-Precision Digital Humidity Sensor",
  price: 101.00,
  originalPrice: 120.00,
  rating: 4.5,
  reviews: 128,
  description: "Professional-grade digital humidity and temperature sensor module with high accuracy and fast response time. Perfect for weather stations, smart home projects, and industrial applications.",
  inStock: true,
  specifications: [
    { label: "Operating Voltage", value: "3.3V - 5V DC" },
    { label: "Measurement Range", value: "0-100% RH" },
    { label: "Accuracy", value: "±2% RH" },
    { label: "Response Time", value: "<5s" },
    { label: "Interface", value: "I2C/One-wire" }
  ],
  images: [
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600"
  ],
  features: [
    "High precision measurements",
    "Digital output with I2C interface",
    "Low power consumption",
    "Long-term stability",
    "Built-in temperature sensor"
  ]
};

// Sample reviews data
const reviews = [
  {
    id: 1,
    user: "John D.",
    rating: 5,
    date: "2024-02-15",
    title: "Excellent sensor for the price",
    comment: "Works perfectly for my weather station project. Easy to integrate and very accurate readings.",
    helpful: 24
  },
  {
    id: 2,
    user: "Sarah M.",
    rating: 4,
    date: "2024-02-10",
    title: "Good but documentation could be better",
    comment: "The sensor works well but took some time to figure out the proper wiring. Would appreciate better documentation.",
    helpful: 15
  }
];

const ProductDetail = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                    currentImage === index ? 'ring-2 ring-purple-500' : ''
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {Array(5).fill(null).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex space-x-4">
                <button className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="flex-1 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Buy Now
                </button>
                <button className="p-3 border border-gray-700 rounded-lg hover:border-gray-600">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-800 pt-4">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="w-5 h-5 text-gray-400" />
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="w-5 h-5 text-gray-400" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RefreshCcw className="w-5 h-5 text-gray-400" />
                <span>30-Day Return Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-800">
            <div className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium capitalize ${
                    activeTab === tab 
                      ? 'text-purple-500 border-b-2 border-purple-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-gray-300">{product.description}</p>
                <h3 className="text-lg font-medium mt-6">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                {product.specifications.map((spec, index) => (
                  <div 
                    key={index}
                    className="flex justify-between py-3 border-b border-gray-800"
                  >
                    <span className="text-gray-400">{spec.label}</span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-800 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          {Array(5).fill(null).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="font-medium">{review.title}</h4>
                      </div>
                      <span className="text-sm text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{review.comment}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>By {review.user}</span>
                      <span className="mx-2">•</span>
                      <button className="hover:text-white">
                        {review.helpful} people found this helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;