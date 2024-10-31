import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer'
const filterCategories = [
  "Popular",
  "Price",
  "Distance", 
  "Rating",
  "Latest",
  "Brand",
  "Voltage",
  "More"
];

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

const products = [
  {
    id: 1,
    name: "Humidity Sensor",
    description: "High-precision digital humidity and temperature sensor module",
    rating: 4.2,
    reviews: 128,
    price: 101,
    inStock: true
  },
  {
    id: 2,
    name: "Sonic Sensor",
    description: "Ultrasonic distance measuring sensor module",
    rating: 4.5,
    reviews: 89,
    price: 170,
    inStock: true
  },
  // Add more products to fill the grid
  ...Array(8).fill(null).map((_, i) => ({
    id: i + 3,
    name: "Humidity Sensor",
    description: "High-precision digital humidity and temperature sensor module",
    rating: 4.2,
    reviews: 128,
    price: 101,
    inStock: true
  }))
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden h-[300px] mb-8">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div 
            key={banner.id}
            className="w-full flex-shrink-0 relative"
          >
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

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
    <div className="relative">
      <img 
        src="/api/placeholder/200/200" 
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <button className="absolute top-2 right-2 p-1 bg-gray-900/50 rounded-full">
        <Heart className="w-4 h-4" />
      </button>
    </div>
    <h3 className="text-white text-sm font-medium mb-1">{product.name}</h3>
    <p className="text-gray-400 text-xs mb-2 flex-grow">{product.description}</p>
    <div className="flex items-center mb-2">
      <div className="flex items-center">
        {Array(5).fill(null).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(product.rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-gray-400 text-xs ml-2">({product.reviews})</span>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <span className="text-xs text-gray-400">From</span>
        <span className="text-white ml-1">₹{product.price}</span>
      </div>
      {product.inStock ? (
        <span className="text-xs text-green-400">In Stock</span>
      ) : (
        <span className="text-xs text-red-400">Out of Stock</span>
      )}
    </div>
  </div>
);

const CategoriesPage = () => {
  return (
    <>
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

      <Carousel />

      <div className="px-6 py-4 flex space-x-2 overflow-x-auto scrollbar-hide">
        {filterCategories.map((category, index) => (
          <button
            key={index}
            className="px-4 py-1 bg-gray-800 rounded-full text-sm text-gray-300 whitespace-nowrap hover:bg-gray-700"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="px-6 py-4">
        <h2 className="text-xl font-medium mb-6">/suggested for you!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
    <Footer></Footer>
    </>
  );
};

export default CategoriesPage;