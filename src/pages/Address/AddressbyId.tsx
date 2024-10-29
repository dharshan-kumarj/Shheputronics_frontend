// src/pages/SingleAddress.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAddressById, Address } from '../../API/Address/FetchAddress';

const SingleAddress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadAddress = async () => {
      if (!id) {
        setError('No address ID provided');
        return;
      }

      try {
        const result = await fetchAddressById(parseInt(id));
        
        if (result.success && result.data) {
          setAddress(result.data);
        } else {
          setError(result.error || 'Failed to load address');
          if (result.statusCode === 404) {
            // Optionally redirect back to addresses list
            setTimeout(() => navigate('/addresses'), 3000);
          }
        }
      } catch (err) {
        setError('Something went wrong!');
      } finally {
        setLoading(false);
      }
    };

    loadAddress();
  }, [id, navigate]);

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

  if (!address) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded shadow-lg">
          Address not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{address.name}</h2>
          {address.is_default && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Default Address
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <p className="text-gray-600">{address.phone}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">Address Details</h3>
            <div className="space-y-2 text-gray-600">
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => navigate('/addresses')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back to Addresses
            </button>
            <button
              onClick={() => navigate(`/addresses/edit/${address.id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAddress;