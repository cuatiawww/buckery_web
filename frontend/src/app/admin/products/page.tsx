/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { menuService } from '@/services/api';
import type { Product, Category } from '@/services/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AlertCircle, Loader2, PlusCircle, ArrowLeft, Eye, EyeOff, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductManagement() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      setIsAuthenticated(true);
      
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          menuService.getAllProducts(),
          menuService.getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router]);
  

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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };
  // In page.tsx, update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Not authenticated. Please login.');
      router.push('/admin/login');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('stock', formData.stock.toString());
      formDataToSend.append('category', formData.category.toString());
      formDataToSend.append('is_active', 'true');  // Set default is_active value
      
      // Handle image
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }
  
      console.log('Submitting form data...');
      // Log FormData contents for debugging
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
  
      if (editingId) {
        await menuService.updateProduct(editingId, formDataToSend);
      } else {
        await menuService.createProduct(formDataToSend);
      }
      
      // Reset form after successful submission
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
      await fetchProducts();
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError('Session expired. Please login again.');
          Cookies.remove('token');
          router.push('/admin/login');
        } else {
          setError(
            error.response?.data?.detail || 
            error.response?.data?.error || 
            'Failed to create product'
          );
        }
      } else {
        setError('An unexpected error occurred');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center">
        <Loader2 className="w-32 h-32 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6 mr-2" />
                Back to Dashboard
              </a>
            </div>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingId(null);
                setFormData({
                  name: '',
                  price: 0,
                  description: '',
                  stock: 0,
                  category: 1,
                  image: null,
                });
              }}
              className="bg-tertiary hover:bg-primary text-black px-4 py-2 rounded-lg border-4 border-black font-bold flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData({ ...formData, price: isNaN(value) ? 0 : value });
                    }}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    rows={3}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Image</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-black"
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg border-4 border-black font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tertiary hover:bg-primary rounded-lg border-4 border-black font-bold"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${typeof product.price === "number" ? product.price.toFixed(2) : "Invalid price"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {categories.find(c => c.id === product.category)?.name || "Unknown Category"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(product)}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                            product.is_active
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {product.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}