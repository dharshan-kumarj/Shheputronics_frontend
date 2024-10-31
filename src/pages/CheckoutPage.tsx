import React, { useState } from 'react';

// SVG Icons as components
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Rest of the sample data remains the same
const sampleAddresses = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 9876543210",
    isDefault: true
  },
  {
    id: 2,
    name: "John Doe",
    address: "456 Park Avenue",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    phone: "+91 9876543211",
    isDefault: false
  }
];

const sampleProduct = {
  id: 1,
  name: "High-Precision Digital Humidity Sensor",
  image: "/api/placeholder/100/100",
  price: 101.00,
  maxQuantity: 10
};

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState(sampleAddresses);
  const [selectedAddress, setSelectedAddress] = useState(sampleAddresses[0].id);
  const [quantity, setQuantity] = useState(1);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false
  });

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= sampleProduct.maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const id = addresses.length + 1;
    setAddresses([...addresses, { ...newAddress, id }]);
    setIsAddingAddress(false);
    setNewAddress({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      isDefault: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center text-sm bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  <div className="w-4 h-4 mr-2">
                    <PlusIcon />
                  </div>
                  Add New Address
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((address) => (
                  <div 
                    key={address.id}
                    className={`border ${
                      selectedAddress === address.id 
                        ? 'border-purple-500' 
                        : 'border-gray-700'
                    } rounded-lg p-4 cursor-pointer hover:border-purple-500`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <div className="ml-4">
                          <div className="flex items-center">
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
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
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">Product Details</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={sampleProduct.image}
                    alt={sampleProduct.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium">{sampleProduct.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">₹{sampleProduct.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-1 rounded-lg hover:bg-gray-700"
                  >
                    <div className="w-4 h-4">
                      <MinusIcon />
                    </div>
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-1 rounded-lg hover:bg-gray-700"
                  >
                    <div className="w-4 h-4">
                      <PlusIcon />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{(sampleProduct.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span>₹{(sampleProduct.price * quantity * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      ₹{(sampleProduct.price * quantity * 1.18).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg mt-6 hover:bg-purple-700">
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Add New Address</h3>
              <button 
                onClick={() => setIsAddingAddress(false)}
                className="text-gray-400 hover:text-white"
              >
                <div className="w-5 h-5">
                  <CloseIcon />
                </div>
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4">
              {/* Form fields remain the same */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="default"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="default" className="text-sm">Set as default address</label>
              </div>
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Add Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;