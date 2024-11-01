// components/Navbar.tsx
import React from 'react';
import { Search, ShoppingCart, Heart } from 'lucide-react';

export default function Navbar() {
    return (
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
    );
}

