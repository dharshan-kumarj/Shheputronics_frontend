// src/pages/Products.tsx

import React, { useState } from 'react';
import { fetchAllProducts } from '../../api/Products';

const Products: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    min_price: '',
    max_price: '',
    avg_rating: '',
    categories: '',
    color: '',
    memory: '',
    in_stock: true,
    sort_by: 'price',
    sort_order: 'asc',
    page: '1',
    limit: '10'
  });

  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Format the data for API
    const queryParams = {
      name: formData.name,
      min_price: Number(formData.min_price),
      max_price: Number(formData.max_price),
      avg_rating: Number(formData.avg_rating),
      categories: formData.categories.split(',').map(Number).filter(n => !isNaN(n)),
      attributes: {
        color: formData.color,
        memory: formData.memory
      },
      in_stock: formData.in_stock,
      sort_by: formData.sort_by,
      sort_order: formData.sort_order as 'asc' | 'desc',
      page: Number(formData.page),
      limit: Number(formData.limit)
    };

    try {
      const result = await fetchAllProducts(queryParams);
      
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">FetchALL Product Search</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="number"
              name="min_price"
              value={formData.min_price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="number"
              name="max_price"
              value={formData.max_price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Average Rating</label>
            <input
              type="number"
              name="avg_rating"
              value={formData.avg_rating}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categories (comma-separated IDs)</label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="1,2,3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Memory</label>
            <input
              type="text"
              name="memory"
              value={formData.memory}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              name="sort_by"
              value={formData.sort_by}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <select
              name="sort_order"
              value={formData.sort_order}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Search Products
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Display products */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-bold">{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Rating: {product.rating}</p>
            {/* Add more product details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;