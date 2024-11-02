import React, { useRef } from 'react';
import { Search, Heart, ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import hero_icon from '../assets/home/hero.svg'
const categories = [
  {
    title: "Sensors & Transducers",
    image: "/api/placeholder/120/120",
    categoryPath: "/sensors"
  },
  {
    title: "Transistors & FETs",
    image: "/api/placeholder/120/120",
    categoryPath: "/transistors"
  },
  {
    title: "Connectors & Cables",
    image: "/api/placeholder/120/120",
    categoryPath: "/connectors"
  },
  {
    title: "Diodes & Rectifiers",
    image: "/api/placeholder/120/120",
    categoryPath: "/rectifiers"
  },
  {
    title: "LEDs & Displays",
    image: "/api/placeholder/120/120",
    categoryPath: "/displays"
  },
  {
    title: "Cables",
    image: "/api/placeholder/120/120",
    categoryPath: "/cables"
  }
];

const ElectronicsDarkStore = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryPath) => {
    navigate(`/categories`, { state: { selectedCategory: categoryPath } });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with Gradient Text */}
      <div className="px-6 lg:px-12 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-purple-500 inline-block text-transparent bg-clip-text">
                Power Your Projects
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-purple-800 inline-block text-transparent bg-clip-text">
                with Precision and
              </span>
              <span className="tracking-wider text-purple-400">
                Value  {" ...."}
              </span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md">
              We provide you with the best electronic components at reasonable prices.
              Whether you're a hobbyist, student, or professional, we have got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 pt-4">
              <button className="bg-gradient-to-r from-gray-100 to-gray-200 text-black px-6 py-2 rounded-full text-sm hover:opacity-90 transition-opacity">
                /buy in bulk
              </button>
              <button className="border border-gray-700 px-6 py-2 rounded-full text-sm hover:border-gray-600 transition-colors">
                /we will do
              </button>
            </div>
          </div>

          {/* Hero Image - Hidden on Mobile */}
          <div className="hidden lg:block relative">
            <div className="absolute top-0 right-0 w-full h-full">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={hero_icon}
                  alt="Circuit Board"
                  className="object-contain w-[800px] h-[600px]" // Increased fixed dimensions
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-6 lg:px-12 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium">/categories</h2>
          <button
            className="flex items-center text-sm text-gray-400 hover:text-gray-300 bg-gray-800/50 px-4 py-1 rounded-full"
            onClick={() => handleCategoryClick("")}
          >
            See more <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Scroll Buttons - Hidden on Mobile */}
        <button
          onClick={() => scroll('left')}
          className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide relative"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex space-x-4 min-w-min pb-4">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.categoryPath)}
                className="flex-shrink-0 w-36 lg:w-48 bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-gray-300">{category.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
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
    </div>
  );
};

export default ElectronicsDarkStore;