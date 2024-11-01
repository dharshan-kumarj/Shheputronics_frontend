// components/Carousel.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full overflow-hidden h-[300px] mb-8">
            <div 
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="w-full flex-shrink-0 relative">
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
                onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
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
}
