import React, { useRef } from 'react';
import { Search, Heart, ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react';

const categories = [
  {
    title: "Sensors & Transducers",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Resistors & Capacitors",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Diodes & Rectifiers",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Transistors & FETs",
    image: "/api/placeholder/120/120",
  },
  {
    title: "LEDs & Displays",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Connectors & Cables",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Microcontrollers",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Development Boards",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Power Supplies",
    image: "/api/placeholder/120/120",
  },
  {
    title: "Test Equipment",
    image: "/api/placeholder/120/120",
  }
];

const ElectronicsDarkStore = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
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

      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-8 px-12 py-16">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight">
            Power Your Projects with{" "}
            <span className="text-purple-500">
              Precision and Value
              <span className="tracking-wider">
                {" ...."}
              </span>
            </span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md">
            We provide you with the best electronic components at reasonable prices. Whether you're a hobbyist, student, or professional, we have got you covered.
          </p>
          <div className="flex space-x-4 pt-4">
            <button className="bg-gray-100 text-black px-6 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors">
              /buy in bulk
            </button>
            <button className="border border-gray-700 px-6 py-2 rounded-full text-sm hover:border-gray-600 transition-colors">
              /we will do
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="relative w-full h-full">
              <img 
                src="/api/placeholder/600/400"
                alt="Circuit Board"
                className="object-contain w-full h-full"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-12 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-medium">/categories</h2>
          <button className="flex items-center text-sm text-gray-400 hover:text-gray-300 bg-gray-800/50 px-4 py-1 rounded-full">
            See more <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        {/* Scroll Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
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
                className="flex-shrink-0 w-48 bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors duration-200"
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

        {/* Custom Scrollbar */}
        <style jsx global>{`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge and Firefox */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </div>
    </div>
  );
};

export default ElectronicsDarkStore;