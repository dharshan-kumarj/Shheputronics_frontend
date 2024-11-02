// pages/OrderSuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, ArrowLeft, Loader, AlertCircle, ChevronLeftCircle } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { format } from 'date-fns';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  status: string;
  product_name: string;
  sku: string;
  description: string;
  thumbnail_url: string;
}

interface Order {
  order_id: number;
  customer_id: number;
  address_id: number;
  order_date: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

interface OrdersResponse {
  user_id: number;
  orders: Order[];
  total_amount: number;
}

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
        setLoading(true);
        setError(null);
      
        try {
          const token = Cookies.get('auth_token');
          if (!token) {
            throw new Error('Authentication required');
          }
      
          const response = await axios.get<OrdersResponse>(
            'https://ecommerce.portos.site/protected/orders',
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
      
          console.log("Fetched orders:", response.data.orders); // Log fetched orders
          console.log("Order ID from params:", orderId); // Log the orderId from params
      
          // Ensure orderId is converted to a number for comparison
          const foundOrder = response.data.orders.find(
            order => order.order_id === Number(orderId)
          );
      
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            throw new Error('Order not found');
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              navigate('/login');
            } else {
              setError(err.response?.data?.message || 'Failed to fetch order details');
            }
          } else {
            setError('An unexpected error occurred');
          }
        } finally {
          setLoading(false);
        }
      };
      

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 flex items-center">
            <AlertCircle className="w-8 h-8 text-red-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-red-500">Error Loading Order</h3>
              <p className="text-red-400">{error || 'Order not found'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'processing':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'shipped':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'delivered':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            <span className="text-gray-400">
              Ordered on {formatDate(order.order_date)}
            </span>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
              <p className="text-gray-400">Order #{order.order_id}</p>
            </div>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-sm text-gray-400 mt-1">SKU: {item.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-gray-400">
                        Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                      </div>
                      <div className="font-medium">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-700 p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Truck className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Shipping Updates</h2>
          </div>
          <p className="text-gray-400">
            You will receive shipping updates and tracking information via email when your order ships.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;