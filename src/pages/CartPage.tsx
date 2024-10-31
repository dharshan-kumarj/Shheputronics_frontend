import React, { useState } from 'react';

// SVG Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

// Sample cart items
const initialCartItems = [
  {
    id: 1,
    name: "High-Precision Digital Humidity Sensor",
    image: "/api/placeholder/100/100",
    price: 101.00,
    maxQuantity: 10,
    quantity: 2
  },
  {
    id: 2,
    name: "Temperature Sensor Module",
    image: "/api/placeholder/100/100",
    price: 75.50,
    maxQuantity: 8,
    quantity: 1
  },
  {
    id: 3,
    name: "Ultrasonic Distance Sensor",
    image: "/api/placeholder/100/100",
    price: 150.00,
    maxQuantity: 5,
    quantity: 1
  }
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: Math.min(Math.max(1, newQuantity), item.maxQuantity)
        };
      }
      return item;
    }));
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const shipping = 0; // Free shipping
  const tax = calculateSubtotal() * 0.18; // 18% tax
  const total = calculateSubtotal() + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">₹{item.price.toFixed(2)}</p>
                        <p className="text-sm text-green-400 mt-1">In Stock</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg hover:bg-gray-700"
                          disabled={item.quantity <= 1}
                        >
                          <div className="w-4 h-4">
                            <MinusIcon />
                          </div>
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg hover:bg-gray-700"
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <div className="w-4 h-4">
                            <PlusIcon />
                          </div>
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 flex items-center text-sm"
                      >
                        <div className="w-4 h-4 mr-1">
                          <TrashIcon />
                        </div>
                        Remove
                      </button>
                      <p className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">Your cart is empty</p>
                <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                  <button className="w-full border border-gray-700 py-3 rounded-lg hover:bg-gray-700">
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Have a coupon?</h3>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Enter coupon code"
                    className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-sm"
                  />
                  <button className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;