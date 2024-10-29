// src/pages/ProductReview.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productReview, ProductReviewData } from '../../API/Products';

const ProductReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [formData, setFormData] = useState<ProductReviewData>({
    order_id: 0,
    product_id: 0,
    rating: 1,
    comment: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'order_id' || name === 'product_id' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await productReview(formData);
      
      if (result.success) {
        setSuccess('Review submitted successfully!');
        setFormData({
          order_id: 0,
          product_id: 0,
          rating: 1,
          comment: ''
        });
        setTimeout(() => navigate(`/product/${formData.product_id}`), 2000);
      } else {
        setError(result.error || 'Failed to submit review');
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
        <h2 className="text-2xl font-bold mb-6">Submit Product Review</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order ID
            </label>
            <input
              type="number"
              name="order_id"
              value={formData.order_id || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              type="number"
              name="product_id"
              value={formData.product_id || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              rows={4}
              placeholder="Write your review here..."
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
              onClick={() => navigate(-1)}
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
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReviewPage;