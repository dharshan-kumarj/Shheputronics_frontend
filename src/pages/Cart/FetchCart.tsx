// src/pages/Cart.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, CartItem } from '../../API/Cart/FetchCart';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const result = await getCart();
      
      if (result.success && result.data) {
        setCartItems(result.data.items);
        setTotalAmount(result.data.total_amount);
        setTotalItems(result.data.total_items);
      } else {
        setError(result.error || 'Failed to load cart');
      }
    } catch (err) {
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b pb-4 last:border-b-0"
                >
                  <img
                    src={item.product.thumbnail_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-blue-600 font-medium">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total ({totalItems} items):</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => navigate('/products')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded border border-gray-300"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;