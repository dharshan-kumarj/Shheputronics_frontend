// src/pages/PlaceOrder.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder, OrderItem } from '../../API/Order';
import { fetchAllAddresses } from '../../API/Address/FetchAddress'; // Import address fetch function

interface FormData {
  address_id: string;
  product_id: string;
  quantity: string;
}

interface Address {
  id: number;
  // other address fields...
}

const PlaceOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    address_id: '',
    product_id: '',
    quantity: ''
  });

  // Fetch addresses when component mounts
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const result = await fetchAllAddresses();
        if (result.success && result.data) {
          setAddresses(result.data);
        } else {
          setError('Failed to load addresses');
        }
      } catch (err) {
        setError('Failed to load addresses');
      }
    };

    loadAddresses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate address_id
    const selectedAddressId = Number(formData.address_id);
    const addressExists = addresses.some(addr => addr.id === selectedAddressId);
    
    if (!addressExists) {
      setError('Please select a valid address');
      setLoading(false);
      return;
    }

    const orderItem: OrderItem = {
      product_id: Number(formData.product_id),
      quantity: Number(formData.quantity)
    };

    const orderData = {
      address_id: selectedAddressId,
      items: [orderItem]
    };

    try {
      const result = await placeOrder(orderData);
      
      if (result.success) {
        setSuccess('Order placed successfully!');
        setFormData({
          address_id: '',
          product_id: '',
          quantity: ''
        });
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        setError(result.error || 'Failed to place order');
      }
    } catch (err) {
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Place Order</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Address
            </label>
            <select
              name="address_id"
              value={formData.address_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select an address</option>
              {addresses.map(address => (
                <option key={address.id} value={address.id}>
                  {address.id} - {address.street}, {address.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              type="number"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              min="1"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderPage;