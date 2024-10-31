import React, { useState } from 'react';

// SVG Icons
const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
    <path d="m3.3 7 8.7 5 8.7-5"></path>
    <path d="M12 22V12"></path>
  </svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"></path>
    <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"></path>
    <circle cx="7" cy="18" r="2"></circle>
    <circle cx="17" cy="18" r="2"></circle>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Sample Orders Data
const orders = [
  {
    id: "ORD123456",
    date: "2024-02-15",
    total: 327.50,
    status: "delivered",
    deliveryDate: "2024-02-18",
    trackingId: "TRK789012",
    items: [
      {
        id: 1,
        name: "High-Precision Digital Humidity Sensor",
        quantity: 2,
        price: 101.00,
        image: "/api/placeholder/80/80"
      },
      {
        id: 2,
        name: "Temperature Sensor Module",
        quantity: 1,
        price: 75.50,
        image: "/api/placeholder/80/80"
      }
    ],
    timeline: [
      { status: "ordered", date: "2024-02-15 09:30 AM", completed: true },
      { status: "processing", date: "2024-02-16 10:15 AM", completed: true },
      { status: "shipped", date: "2024-02-17 02:45 PM", completed: true },
      { status: "delivered", date: "2024-02-18 11:20 AM", completed: true }
    ]
  },
  {
    id: "ORD123457",
    date: "2024-02-20",
    total: 150.00,
    status: "shipped",
    expectedDelivery: "2024-02-23",
    trackingId: "TRK789013",
    items: [
      {
        id: 3,
        name: "Ultrasonic Distance Sensor",
        quantity: 1,
        price: 150.00,
        image: "/api/placeholder/80/80"
      }
    ],
    timeline: [
      { status: "ordered", date: "2024-02-20 14:20 PM", completed: true },
      { status: "processing", date: "2024-02-21 09:45 AM", completed: true },
      { status: "shipped", date: "2024-02-22 03:30 PM", completed: true },
      { status: "delivered", date: null, completed: false }
    ]
  }
];

const OrderStatusBar = ({ timeline }) => {
  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-green-500"
          style={{ 
            width: `${(timeline.filter(t => t.completed).length / timeline.length) * 100}%`
          }}
        />
      </div>
      <div className="relative flex justify-between">
        {timeline.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.completed 
                  ? 'bg-green-500' 
                  : 'bg-gray-700'
              }`}
            >
              {step.completed && <CheckIcon />}
            </div>
            <span className="mt-2 text-sm capitalize">{step.status}</span>
            <span className="text-xs text-gray-400 mt-1">
              {step.date ? new Date(step.date).toLocaleDateString() : '-'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderTrackingPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(orders[0]);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1 space-y-4">
            {orders.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedOrder.id === order.id 
                    ? 'bg-gray-800 border border-purple-500'
                    : 'bg-gray-800 border border-transparent hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    order.status === 'delivered' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm">₹{order.total.toFixed(2)}</p>
              </button>
            ))}
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Order #{selectedOrder.id}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Placed on {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    Tracking ID: {selectedOrder.trackingId}
                  </p>
                  {selectedOrder.status === 'delivered' ? (
                    <p className="text-sm text-green-400">
                      Delivered on {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-blue-400">
                      Expected by {new Date(selectedOrder.expectedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <OrderStatusBar timeline={selectedOrder.timeline} />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Order Items</h3>
              {selectedOrder.items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              <div className="border-t border-gray-700 pt-4 mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button className="text-purple-500 hover:text-purple-400">
                Download Invoice
              </button>
              <button className="text-purple-500 hover:text-purple-400">
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;