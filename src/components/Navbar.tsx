import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      const toggle = document.getElementById('menu-toggle');
      if (menu && toggle && !menu.contains(event.target as Node) && !toggle.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleExplore = () => {
    navigate('/products?search=');
  };

  const isActive = (path: string) => {
    if (path === '/products') {
      return location.pathname === '/products' || location.search.includes('search=');
    }
    return location.pathname === path;
  };

  const getButtonClasses = (path: string) => {
    const baseClasses = "px-3 py-1 rounded-full transition-all duration-300";
    const activeClasses = "text-purple-400 bg-purple-500/10 font-medium";
    const inactiveClasses = "text-gray-400 hover:text-white hover:bg-black";
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const getMobileButtonClasses = (path: string) => {
    const baseClasses = "w-full px-4 py-3 text-left transition-all duration-300 flex items-center space-x-3";
    const activeClasses = "text-purple-400 bg-purple-500/10 font-medium";
    const inactiveClasses = "text-gray-400 hover:text-white hover:bg-black";
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-white rounded-full mr-2 group-hover:scale-105 transition-transform"></div>
            <span className="text-sm font-medium text-white">/ sheeputronics</span>
          </Link>

          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 space-x-2 text-sm">
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
              to="/orders"
              className={getButtonClasses('/orders')}
            >
              My orders
            </Link>
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
                className="bg-black text-white px-4 py-2 rounded-full w-64
                  border border-gray-700 focus:border-purple-500 focus:outline-none
                  transition-all duration-300"
              />
              <Search
                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white absolute
                  right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                onClick={handleSearch}
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-black rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="p-2 hover:bg-black rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-white rounded-full"></div>
              <span className="text-sm font-medium text-white">sheeputronics</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-black rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              <button
                id="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-black rounded-full transition-colors relative"
              >
                <div className="relative w-5 h-5">
                  <Menu className={`absolute inset-0 text-gray-400 transition-all duration-300 transform ${
                    isMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`} />
                  <X className={`absolute inset-0 text-gray-400 transition-all duration-300 transform ${
                    isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                  }`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className={`absolute w-full bg-black border-b border-gray-800 transition-all duration-300 ${
            showSearch ? 'top-14 opacity-100' : '-top-full opacity-0'
          }`}>
            <div className="p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-black text-white pl-10 pr-4 py-2 rounded-lg
                    border border-gray-700 focus:border-purple-500 focus:outline-none"
                  autoFocus
                />
                <Search
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            className={`fixed right-0 top-14 w-64 bg-black border-l border-gray-800 h-[calc(100vh-3.5rem)]
              transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            <div className="py-2 space-y-1">
              <button
                onClick={handleExplore}
                className={getMobileButtonClasses('/products')}
              >
                <Search className="w-5 h-5" />
                <span>Explore</span>
              </button>
              <Link
                to="/categories"
                className={getMobileButtonClasses('/categories')}
              >
                <span className="flex items-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  <span>Categories</span>
                </span>
              </Link>
              <Link
                to="/orders"
                className={getMobileButtonClasses('/orders')}
              >
                <span className="flex items-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12" y2="17" />
                  </svg>
                  <span>My Orders</span>
                </span>
              </Link>
              <div className="border-t border-gray-800 my-2"></div>
              <Link
                to="/profile"
                className={getMobileButtonClasses('/profile')}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link
                to="/cart"
                className={getMobileButtonClasses('/cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu and search */}
      {(isMenuOpen || showSearch) && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setShowSearch(false);
          }}
        />
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-14" />
    </>
  );
}