// src/pages/DeleteCartItem.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCart } from '../../API/Cart/EditCart';

const DeleteCartItem: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleDelete = async () => {
    if (!id) {
      setError('No cart item ID provided');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log('Deleting cart item:', id);
      const result = await deleteCart(parseInt(id));

      setDebugInfo({
        request: {
          id: parseInt(id)
        },
        response: result
      });

      if (result.success) {
        setSuccess('Cart item deleted successfully!');
        setTimeout(() => {
          navigate('/cart');
        }, 1500);
      } else {
        setError(result.error || 'Failed to delete cart item');
      }
    } catch (err) {
      setError('Something went wrong!');
      setDebugInfo({ error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Delete Cart Item #{id}</h2>

        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this item from your cart?
          </p>

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
              onClick={handleDelete}
              disabled={loading}
              className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Deleting...' : 'Delete Item'}
            </button>
          </div>
        </div>

        {/* Debug Information */}
        {debugInfo && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteCartItem;