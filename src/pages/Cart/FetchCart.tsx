import React, { useState, useEffect } from 'react';
import { getCart } from '../../API/Cart/FetchCart';

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const result = await getCart();
      setResponseData(result);
    } catch (err) {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">API Response Debug View</h1>
          <button 
            onClick={loadCart}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Request Status</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${responseData?.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{responseData?.success ? 'Success' : 'Failed'}</span>
              </div>
              {responseData?.statusCode && (
                <p className="text-gray-600 mt-1">Status Code: {responseData.statusCode}</p>
              )}
            </div>

            {responseData?.error && (
              <div className="bg-red-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2 text-red-700">Error</h2>
                <p className="text-red-600">{responseData.error}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Raw Response Data</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>

            {responseData?.data?.items && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Items Count</h2>
                <p>{responseData.data.items.length} items in cart</p>
                <p className="text-gray-600 mt-1">
                  Total Amount: ${responseData.data.total_amount?.toFixed(2) || '0.00'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;