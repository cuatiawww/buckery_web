/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { menuService } from '@/services/api';
import type { Product, Category } from '@/services/api';
import Image from 'next/image';
import router from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    category: 1,
    image: null as File | null,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatPrice = (price: any): string => {
    const numericPrice = parseFloat(price);
    return !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'Invalid price';
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
  
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchInitialData();
  }, []);
  

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await menuService.getAllProducts();
      setProducts(data);
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await menuService.getAllCategories();
      setCategories(data);
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    
    if (!token) {
      setError('Session expired. Please login again.');
      router.push('/admin/login');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, String(value));
        }
      });
  
      if (editingId) {
        await menuService.updateProduct(editingId, formDataToSend);
      } else {
        await menuService.createProduct(formDataToSend);
      }
      
      setShowAddForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        category: 1,
        image: null,
      });
      fetchProducts();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError('Session expired. Please login again.');
        router.push('/admin/login');
      } else {
        setError(editingId ? 'Failed to update product' : 'Failed to create product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category: product.category,
      image: null,
    });
    setEditingId(product.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await menuService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  const handleUpdateStatus = async (product: Product) => {
    try {
      const formData = new FormData();
      formData.append('is_active', String(!product.is_active));
      await menuService.updateProduct(product.id, formData);
      fetchProducts();
    } catch (error) {
      setError('Failed to update product status');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setEditingId(null);
              setFormData({
                name: '',
                price: 0,
                description: '',
                stock: 0,
                category: 1,
                image: null,
              });
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
onChange={(e) => {
  const value = parseFloat(e.target.value);
  setFormData({ ...formData, price: isNaN(value) ? 0 : value });
}}

                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Image</label>
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
  {product.image && (
    <Image
      src={product.image}
      alt={product.name}
      className="h-10 w-10 rounded-full object-cover"
      width={40} // Ukuran lebar
      height={40} // Ukuran tinggi
    />
  )}
</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {typeof product.price === "number" ? `$${product.price.toFixed(2)}` : "Invalid price"}
</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {categories.find(c => c.id === product.category)?.name || "Unknown Category"}

                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(product)}
                    className={`${
                      product.is_active 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {product.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}