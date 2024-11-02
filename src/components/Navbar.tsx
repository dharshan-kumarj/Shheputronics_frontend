import React, { useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react'; // Import User icon from lucide-react
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleExplore = () => {
    navigate('/products?search=');
  };

  // Function to check if a route is active
  const isActive = (path: string) => {
    if (path === '/products') {
      return location.pathname === '/products' || location.search.includes('search=');
    }
    return location.pathname === path;
  };

  // Function to get button classes based on active state
  const getButtonClasses = (path: string) => {
    const baseClasses = "px-3 py-1 rounded-full transition-all duration-300";
    const activeClasses = "text-purple-400 bg-purple-500/10 font-medium";
    const inactiveClasses = "text-gray-400 hover:text-white hover:bg-gray-800";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <div className="flex items-center space-x-8">
        {/* Logo Section */}
        <Link 
          to="/"
          className="flex items-center group hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-white rounded-full mr-2 group-hover:scale-105 transition-transform"></div>
          <span className="text-sm font-medium">/ sheeputronics</span>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-2 text-sm">
          <button 
            onClick={handleExplore}
            className={getButtonClasses('/products')}
          >
            Explore
          </button>
          <Link 
            to="/categories"
            className={getButtonClasses('/categories')}
          >
            Categories
          </Link>
          <Link 
            to="/support"
            className={getButtonClasses('/support')}
          >
            Support
          </Link>
        </div>
      </div>

      {/* Search and Icons Section */}
      <div className="flex items-center space-x-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-gray-800 text-white px-4 py-2 rounded-full w-64
              border border-gray-700 focus:border-purple-500 focus:outline-none
              transition-all duration-300"
          />
          <Search
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white absolute
              right-3 top-1/2 transform -translate-y-1/2 transition-colors"
            onClick={handleSearch}
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2">
          {/* User Icon */}
          <button 
            onClick={() => navigate('/profile')} // Navigate to /profile
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <User className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
          
          {/* Cart Icon */}
          <button 
            onClick={() => navigate('/cart')} // Navigate to /cart
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  );
}
