// src/pages/UpdateCart.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCart, UpdateCartData } from '../../API/Cart/EditCart';

const UpdateCartPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState<UpdateCartData>({
    quantity: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setFormData({ quantity: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('No cart item ID provided');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await updateCart(parseInt(id), formData);
      
      if (result.success) {
        setSuccess('Cart updated successfully!');
        setTimeout(() => {
          navigate('/cart');
        }, 1500);
      } else {
        setError(result.error || 'Failed to update cart');
      }
    } catch (err) {
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Update Cart Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Quantity
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
              onClick={() => navigate('/cart')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded border border-gray-300"
              disabled={loading}
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
              {loading ? 'Updating...' : 'Update Quantity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCartPage;