// src/pages/Profile/AddressList.tsx

import React, { useState, useEffect } from 'react';
import { fetchAllAddresses } from '../../API/Address/FetchAddress';

interface Address {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const AddressList: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const result = await fetchAllAddresses();
      
      if (result.success && result.data) {
        setAddresses(result.data);
      } else {
        setError(result.error || 'Failed to load addresses');
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
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Addresses</h2>

      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No addresses found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between">
                <h3 className="font-bold">{address.name}</h3>
                {address.is_default && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                    Default
                  </span>
                )}
              </div>
              
              <div className="mt-2 text-gray-600">
                <p>{address.phone}</p>
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;