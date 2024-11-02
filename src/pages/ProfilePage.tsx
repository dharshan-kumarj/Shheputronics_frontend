import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

// Separate AddressForm component
const AddressForm = ({ onSubmit, initialData, buttonText = "Add Address", onCancel }) => {
  const [formData, setFormData] = useState({
    phone: initialData?.phone || "",
    street: initialData?.street || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            required
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button 
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          {buttonText}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-white px-6 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const getToken = () => document.cookie.split('token=')[1].split(';')[0];

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://ecommerce.portos.site/protected/profile', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile data');
      
      const data = await response.json();
      setUserData(data);
      setEditedData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddAddress = async (formData) => {
    try {
      const response = await fetch('https://ecommerce.portos.site/protected/profile/address', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          phone: parseInt(formData.phone)
        })
      });

      if (!response.ok) throw new Error('Failed to add address');
      
      await fetchProfile();
      setIsAddingAddress(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditAddress = async (formData) => {
    try {
      const response = await fetch(`https://ecommerce.portos.site/protected/profile/address/${editingAddress.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          phone: parseInt(formData.phone)
        })
      });

      if (!response.ok) throw new Error('Failed to update address');
      
      await fetchProfile();
      setEditingAddress(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await fetch(`https://ecommerce.portos.site/protected/profile/address/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        // Parse error response
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete address');
      }
      
      await fetchProfile();
      setDeleteError(null); // Clear any existing error
    } catch (err) {
      // Set specific error message if it mentions orders
      if (err.message.toLowerCase().includes('order')) {
        setDeleteError("You have already placed orders with this address. It cannot be deleted.");
      } else {
        setDeleteError("You have already placed orders with this address. It cannot be deleted.");

      }
    }
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      Loading...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="font-medium">{userData.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="font-medium">{new Date(userData.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="font-medium capitalize">{userData.role}</p>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              {!isAddingAddress && !editingAddress && (
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="text-purple-500 hover:text-purple-400"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {isAddingAddress && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Add New Address</h3>
                <AddressForm 
                  onSubmit={handleAddAddress}
                  onCancel={handleCancel}
                />
              </div>
            )}

            {editingAddress && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Edit Address</h3>
                <AddressForm 
                  initialData={editingAddress}
                  onSubmit={handleEditAddress}
                  buttonText="Save Changes"
                  onCancel={handleCancel}
                />
              </div>
            )}

            {/* Tailwind Alert */}
            {deleteError && (
              <div className="relative p-4 mb-6 text-red-200 bg-red-900 border border-red-500 rounded-lg" role="alert">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {/* Alert Icon */}
                    <svg className="flex-shrink-0 w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Error</span>
                    <div>{deleteError}</div>
                  </div>
                  {/* Close button */}
                  <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 bg-red-900 text-red-200 hover:text-white rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-800 inline-flex items-center justify-center h-8 w-8"
                    onClick={() => setDeleteError(null)}
                    aria-label="Close"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-6">
              {userData.addresses.map((address) => (
                <div 
                  key={address.id}
                  className="bg-gray-700 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <p className="text-lg font-medium">{address.street}</p>
                        <span className="text-sm bg-gray-600 px-2 py-1 rounded">
                          {address.phone}
                        </span>
                      </div>
                      <p className="text-gray-400">
                        {address.city}, {address.state}, {address.postal_code}
                      </p>
                      <p className="text-gray-400 capitalize">
                        {address.country}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingAddress(address)}
                        className="text-gray-400 hover:text-white p-2"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-gray-400 hover:text-red-500 p-2"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;