// pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Loader, Plus, Minus, X, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  maxQuantity: number;
}

interface Address {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State Management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState<number | null>(null);
  const [loading, setLoading] = useState({
    addresses: false,
    placeOrder: false,
    addressOperation: false
  });
  const [error, setError] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const token = Cookies.get('auth_token'); // Gets the token from the 'auth_token' cookie
  // Initialize cart items from URL params
  useEffect(() => {
    try {
      const items = searchParams.get('items');
      if (items) {
        const parsedItems = JSON.parse(decodeURIComponent(items));
        setCartItems(parsedItems);
      } else {
        navigate('/cart');
      }
    } catch (err) {
      setError('Invalid cart data');
      navigate('/cart');
    }
  }, [searchParams]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(prev => ({ ...prev, addresses: true }));
      try {
        const response = await axios.get('https://ecommerce.portos.site/protected/profile/addresses', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to header
          },
        });
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0].id);
        }
      } catch (err) {
        setError('Failed to load addresses');
      } finally {
        setLoading(prev => ({ ...prev, addresses: false }));
      }
    };
    fetchAddresses();
  }, []);

  // Handlers
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(Math.max(1, newQuantity), item.maxQuantity) }
          : item
      )
    );
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, addressOperation: true }));

    try {
      // Create payload with phone as integer
      const addressPayload = {
        ...newAddress,
        phone: parseInt(newAddress.phone) // Convert phone to integer
      };

      if (isEditingAddress) {
        await axios.put(`https://ecommerce.portos.site/protected/profile/address/${isEditingAddress}`, addressPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('https://ecommerce.portos.site/protected/profile/address', addressPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Refresh addresses
      const response = await axios.get('https://ecommerce.portos.site/protected/profile/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(response.data);

      setIsAddingAddress(false);
      setIsEditingAddress(null);
      setNewAddress({
        name: '', 
        address: '', 
        city: '', 
        state: '', 
        pincode: '', 
        phone: ''
      });
    } catch (err) {
      setError('Failed to save address');
    } finally {
      setLoading(prev => ({ ...prev, addressOperation: false }));
    }
};

  const handleDeleteAddress = async (addressId: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setLoading(prev => ({ ...prev, addressOperation: true }));
    try {
      await axios.delete(`https://ecommerce.portos.site/protected/profile/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to header
        },
      });
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      if (selectedAddress === addressId) {
        setSelectedAddress(addresses[0]?.id || null);
      }
    } catch (err) {
      setError('Failed to delete address');
    } finally {
      setLoading(prev => ({ ...prev, addressOperation: false }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setLoading(prev => ({ ...prev, placeOrder: true }));
    setError(null);

    try {
      const orderPayload = {
        address_id: selectedAddress,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      const response = await axios.post('https://ecommerce.portos.site/protected/orders', orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to header
        },
      });
      // navigate(`/order/success/${response.data.order_id}`);
      navigate("/orders")
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, placeOrder: false }));
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center text-red-200">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <button
                  onClick={() => setIsAddingAddress(true)}
                  disabled={loading.addressOperation}
                  className="flex items-center px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Add New Address
                </button>
              </div>

              {loading.addresses ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No addresses found. Please add a delivery address.
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(address => (
                    <div
                      key={address.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-colors
                        ${selectedAddress === address.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 hover:border-purple-500'}`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="mt-1 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="ml-4 flex-grow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="font-medium">{address.name}</span>
                              {address.isDefault && (
                                <span className="ml-2 px-2 py-1 text-xs bg-gray-700 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditingAddress(address.id);
                                  setNewAddress({
                                    name: address.name,
                                    address: address.address,
                                    city: address.city,
                                    state: address.state,
                                    pincode: address.pincode,
                                    phone: address.phone,
                                  });
                                }}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address.id);
                                }}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                              >
                                <Trash2 size={16} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            {address.address}, {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Phone: {address.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-purple-400">₹{item.price.toFixed(2)}</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            disabled={item.quantity >= item.maxQuantity}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading.placeOrder || !selectedAddress}
                  className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg
                    hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors flex items-center justify-center"
                >
                  {loading.placeOrder ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {(isAddingAddress || isEditingAddress) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {isEditingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={() => {
                  setIsAddingAddress(false);
                  setIsEditingAddress(null);
                  setNewAddress({
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    pincode: '',
                    phone: ''
                  });
                }}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 
                    focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Address
                </label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  required
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 
                    focus:outline-none focus:border-purple-500 text-white resize-none"
                  placeholder="Enter your street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 
                      focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 
                      focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 6) {
                        setNewAddress(prev => ({ ...prev, pincode: value }));
                      }
                    }}
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 
                      focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Enter PIN code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setNewAddress(prev => ({ ...prev, phone: value }));
                      }
                    }}
                    required
                    maxLength={10}
                    pattern="\d{10}"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 
                      focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-gray-600 rounded 
                    focus:ring-purple-500 focus:ring-offset-gray-800"
                />
                <label htmlFor="defaultAddress" className="ml-2 text-sm text-gray-400">
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAddress(false);
                    setIsEditingAddress(null);
                    setNewAddress({
                      name: '',
                      address: '',
                      city: '',
                      state: '',
                      pincode: '',
                      phone: ''
                    });
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading.addressOperation}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg 
                    hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed 
                    transition-colors flex items-center"
                >
                  {loading.addressOperation ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;