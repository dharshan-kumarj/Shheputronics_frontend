import React, { useState, useEffect } from 'react';
import { Star} from 'lucide-react';  // Add Star to imports

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

const ReviewModal = ({ isOpen, onClose, product, orderId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      order_id: orderId,
      product_id: product.id,
      rating,
      comment
    });
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'} z-50`}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Add Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center mb-4">
          <img 
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="ml-4">
            <h4 className="font-medium">{product.name}</h4>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white px-6 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderStatusBar = ({ timeline }) => {
  // Define the expected order statuses
  const statuses = [
    { status: 'pending', completed: false },
    { status: 'packed', completed: false },
    { status: 'shipped', completed: false },
    { status: 'delivered', completed: false },
  ];

  // Update completed status based on the timeline data
  timeline.forEach(step => {
    const index = statuses.findIndex(s => s.status === step.status);
    if (index !== -1) {
      statuses[index].completed = step.completed;
    }
  });

  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700">
        <div
          className="absolute left-0 top-0 bottom-0 bg-green-500"
          style={{
            width: `${(statuses.filter(s => s.completed).length / statuses.length) * 100}%`
          }}
        />
      </div>
      <div className="relative flex justify-between">
        {statuses.map((step, index) => (
          <div key={step.status} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                  ? 'bg-green-500'
                  : 'bg-gray-700'
                }`}
            >
              {step.completed && <CheckIcon />}
            </div>
            <span className="mt-2 text-sm capitalize">{step.status}</span>
            <span className="text-xs text-gray-400 mt-1">
              {step.completed ? new Date(timeline.find(t => t.status === step.status).date).toLocaleDateString() : '-'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, product: null });
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => document.cookie.split('token=')[1].split(';')[0];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://ecommerce.portos.site/protected/orders', {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        const transformedOrders = data.orders.map(order => ({
          id: order.order_id,
          date: new Date(order.order_date).toLocaleDateString(),
          total: order.total_amount,
          status: order.status,
          items: order.items.map(item => ({
            id: item.product_id,
            name: item.product_name,
            quantity: item.quantity,
            price: item.unit_price,
            image: item.thumbnail_url,
            review: {
              rating: item.rating,
              comment: item.review_comment
            }
          })),
          timeline: getOrderTimeline(order.status)
        }));

        setOrders(transformedOrders);
        if (transformedOrders.length > 0) {
          setSelectedOrder(transformedOrders[0]);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrderTimeline = (status) => {
    const statuses = ['pending', 'packed', 'shipped', 'delivered'];
    const timeline = statuses.map((stat, index) => ({
      status: stat,
      completed: index <= statuses.indexOf(status),
      date: index <= statuses.indexOf(status) ? new Date().toISOString() : null
    }));
    return timeline;
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch('https://ecommerce.portos.site/protected/product/review', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setReviewModal({ isOpen: false, product: null });
      // Optionally show success message
      setSubmitError(null);
    } catch (err) {
      setSubmitError('Failed to submit review. Please try again.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      Loading...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      Error: {error}
    </div>
  );

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
                  selectedOrder && selectedOrder.id === order.id 
                    ? 'bg-gray-800 border border-purple-500'
                    : 'bg-gray-800 border border-transparent hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-gray-400">
                      {order.date}
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
          {selectedOrder && (
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Order #{selectedOrder.id}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Placed on {selectedOrder.date}
                    </p>
                  </div>
                </div>

                <OrderStatusBar timeline={selectedOrder.timeline} />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Order Items</h3>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex flex-col p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
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

                    {/* Review Section */}
                    {selectedOrder.status === 'delivered' && (
                      <div className="mt-4 border-t border-gray-600 pt-4">
                        {item.review.rating > 0 ? (
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={16}
                                    className={star <= item.review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-400">Your Review</span>
                            </div>
                            <p className="text-gray-300 text-sm">{item.review.comment}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReviewModal({ isOpen: true, product: item })}
                            className="text-purple-500 hover:text-purple-400 text-sm inline-flex items-center"
                          >
                            <svg 
                              className="w-4 h-4 mr-1" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                              />
                            </svg>
                            Write a Review
                          </button>
                        )}
                      </div>
                    )}
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
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false, product: null })}
          product={reviewModal.product}
          orderId={selectedOrder.id}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="fixed bottom-4 right-4 bg-red-900 text-red-200 px-6 py-3 rounded-lg shadow-lg z-50">
          {submitError}
          <button 
            onClick={() => setSubmitError(null)}
            className="ml-4 text-red-200 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};


export default OrderTrackingPage;