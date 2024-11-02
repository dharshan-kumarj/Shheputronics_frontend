import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { Loader } from 'lucide-react';

// SVG Icons remain unchanged
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

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = Cookies.get('auth_token');
      const response = await fetch('https://ecommerce.portos.site/protected/cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const formattedItems = data.items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          image: item.thumbnail_url || '/api/placeholder/100/100',
          price: item.price,
          maxQuantity: item.stock,
          quantity: item.quantity,
        }));
        setCartItems(formattedItems);
      } else {
        console.error('Failed to fetch cart items');
      }
      setLoading(false);
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    const itemToUpdate = cartItems.find(item => item.id === itemId);
    if (!itemToUpdate || pendingRequests.has(itemId)) return;

    // Store original state for rollback
    const originalItems = [...cartItems];

    // Optimistically update UI
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.min(Math.max(1, newQuantity), item.maxQuantity) };
      }
      return item;
    }));

    // Add to pending requests
    setPendingRequests(prev => new Set(prev).add(itemId));

    const token = Cookies.get('auth_token');
    try {
      const response = await fetch(`https://ecommerce.portos.site/protected/cart/item/${itemId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      // Rollback on error
      setCartItems(originalItems);
    } finally {
      // Remove from pending requests
      setPendingRequests(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const removeItem = async (itemId) => {
    if (pendingRequests.has(itemId)) return;

    // Store original state for rollback
    const originalItems = [...cartItems];

    // Optimistically update UI
    setCartItems(cartItems.filter(item => item.id !== itemId));

    // Add to pending requests
    setPendingRequests(prev => new Set(prev).add(itemId));

    const token = Cookies.get('auth_token');
    try {
      const response = await fetch(`https://ecommerce.portos.site/protected/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Rollback on error
      setCartItems(originalItems);
    } finally {
      // Remove from pending requests
      setPendingRequests(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  // Rest of the component remains the same
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const shipping = 0;
  const tax = calculateSubtotal() * 0.18;
  const total = calculateSubtotal() + shipping + tax;

  const handleCheckout = () => {
    const items = encodeURIComponent(JSON.stringify(cartItems));
    navigate(`/checkout?items=${items}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 z-50">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                          className="p-1 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                          disabled={item.quantity <= 1 || pendingRequests.has(item.id)}
                        >
                          <div className="w-4 h-4">
                            <MinusIcon />
                          </div>
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                          disabled={item.quantity >= item.maxQuantity || pendingRequests.has(item.id)}
                        >
                          <div className="w-4 h-4">
                            <PlusIcon />
                          </div>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 flex items-center text-sm disabled:opacity-50"
                        disabled={pendingRequests.has(item.id)}
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
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
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
                </div>
                <button 
                  onClick={handleCheckout} 
                  className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;