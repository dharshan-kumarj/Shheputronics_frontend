import React, { useState } from 'react';

// SVG Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20a6 6 0 0 0-12 0"></path>
    <circle cx="12" cy="10" r="4"></circle>
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="2"></rect>
    <path d="M9 9h6"></path>
    <path d="M9 13h6"></path>
    <path d="M9 17h6"></path>
  </svg>
);

const AddressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    dateJoined: "2023-01-15",
    addresses: [
      {
        id: 1,
        type: "Home",
        address: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        isDefault: true
      },
      {
        id: 2,
        type: "Office",
        address: "456 Business Park",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400002",
        isDefault: false
      }
    ],
    recentOrders: [
      {
        id: "ORD123456",
        date: "2024-02-15",
        total: 327.50,
        status: "Delivered"
      },
      {
        id: "ORD123457",
        date: "2024-02-20",
        total: 150.00,
        status: "Processing"
      }
    ]
  });

  const [editedData, setEditedData] = useState(userData);

  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditing(false);
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-purple-500 hover:text-purple-400 flex items-center"
        >
          <EditIcon />
          <span className="ml-2">{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={editedData.name}
              onChange={(e) => setEditedData({...editedData, name: e.target.value})}
              className="w-full bg-gray-700 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={editedData.email}
              onChange={(e) => setEditedData({...editedData, email: e.target.value})}
              className="w-full bg-gray-700 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={editedData.phone}
              onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
              className="w-full bg-gray-700 rounded-lg px-4 py-2"
            />
          </div>
          <button 
            onClick={handleSaveProfile}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="font-medium">{userData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="font-medium">{userData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="font-medium">{new Date(userData.dateJoined).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddressSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button className="text-purple-500 hover:text-purple-400">
          + Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userData.addresses.map((address) => (
          <div 
            key={address.id}
            className="bg-gray-800 rounded-lg p-6 relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <button className="text-gray-400 hover:text-white">
                <EditIcon />
              </button>
            </div>
            <p className="text-gray-300">{address.address}</p>
            <p className="text-gray-400 text-sm">
              {address.city}, {address.state} - {address.pincode}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrdersSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <button className="text-purple-500 hover:text-purple-400">
          View All Orders
        </button>
      </div>

      <div className="space-y-4">
        {userData.recentOrders.map((order) => (
          <div 
            key={order.id}
            className="bg-gray-800 rounded-lg p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">Order #{order.id}</h3>
              <p className="text-sm text-gray-400">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{order.total.toFixed(2)}</p>
              <span className={`text-sm px-2 py-1 rounded-full ${
                order.status === 'Delivered' 
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'profile' 
                    ? 'bg-purple-500 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <UserIcon />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'orders' 
                    ? 'bg-purple-500 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <OrderIcon />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'addresses' 
                    ? 'bg-purple-500 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <AddressIcon />
                <span>Addresses</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              {activeTab === 'profile' && renderProfileSection()}
              {activeTab === 'orders' && renderOrdersSection()}
              {activeTab === 'addresses' && renderAddressSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;