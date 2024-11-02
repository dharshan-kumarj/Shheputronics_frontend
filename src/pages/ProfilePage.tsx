import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Navbar from '../components/Navbar';

import { Loader } from 'lucide-react';
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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 z-50">
      <Loader className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          {/* Profile Section with updated responsive grid */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="font-medium truncate">{userData.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium break-all">{userData.email}</p>
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
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              {!isAddingAddress && !editingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="text-purple-500 hover:text-purple-400 whitespace-nowrap"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {/* Address Form */}
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

            {/* Error Alert */}
            {deleteError && (
              <div className="relative p-4 mb-6 text-red-200 bg-red-900 border border-red-500 rounded-lg" role="alert">
                {/* ... alert content remains the same ... */}
              </div>
            )}

            {/* Address Cards */}
            <div className="grid gap-4 sm:gap-6">
              {userData.addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-gray-700 rounded-lg p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <p className="text-lg font-medium break-words">{address.street}</p>
                        <span className="text-sm bg-gray-600 px-2 py-1 rounded w-fit">
                          {address.phone}
                        </span>
                      </div>
                      <p className="text-gray-400 break-words">
                        {address.city}, {address.state}, {address.postal_code}
                      </p>
                      <p className="text-gray-400 capitalize break-words">
                        {address.country}
                      </p>
                    </div>
                    <div className="flex space-x-2 sm:self-start">
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
    </div>);
};

export default ProfilePage;