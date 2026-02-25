'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { ADMIN_EMAIL } from '@/lib/constants';
import { Plus, Trash2, Edit, Save, X, LogOut, Upload } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    image: '',
    description: '',
    category: '',
    inStock: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check admin authentication
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/auth');
    } else {
      loadProducts();
    }
  }, [router]);

  const loadProducts = () => {
    // In a real app, this would fetch from an API
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    router.push('/');
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      image: newProduct.image,
      description: newProduct.description || '',
      category: newProduct.category || '',
      inStock: newProduct.inStock ?? true,
    };

    const updatedProducts = [...products, product];
    saveProducts(updatedProducts);
    
    setNewProduct({
      name: '',
      price: 0,
      image: '',
      description: '',
      category: '',
      inStock: true,
    });
    setIsAddingProduct(false);
    setIsLoading(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
    }
  };

  const handleUpdateProduct = (productId: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(p =>
      p.id === productId ? { ...p, ...updates } : p
    );
    saveProducts(updatedProducts);
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      if (editingProduct) {
        handleUpdateProduct(editingProduct, { image: imageUrl });
      } else {
        setNewProduct(prev => ({ ...prev, image: imageUrl }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your products</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {ADMIN_EMAIL}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Button */}
        <div className="mb-8">
          {!isAddingProduct ? (
            <button
              onClick={() => setIsAddingProduct(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Product</span>
            </button>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (UGX) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Clothing, Toys"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="rounded text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddingProduct(false);
                    setNewProduct({
                      name: '',
                      price: 0,
                      image: '',
                      description: '',
                      category: '',
                      inStock: true,
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  disabled={isLoading}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Products ({products.length})
            </h2>
          </div>
          
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products yet. Add your first product above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMCAxMEgzMFYzMEgxMFYxMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+Cg==';
                            }}
                          />
                          <div>
                            {editingProduct === product.id ? (
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => handleUpdateProduct(product.id, { name: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            )}
                            {product.description && (
                              <div className="text-sm text-gray-500">
                                {product.description.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingProduct === product.id ? (
                          <input
                            type="text"
                            value={product.category}
                            onChange={(e) => handleUpdateProduct(product.id, { category: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                            {product.category || 'Uncategorized'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingProduct === product.id ? (
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => handleUpdateProduct(product.id, { price: Number(e.target.value) })}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">
                            UGX {product.price.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingProduct === product.id ? (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={product.inStock}
                              onChange={(e) => handleUpdateProduct(product.id, { inStock: e.target.checked })}
                              className="rounded text-pink-600 focus:ring-pink-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">In Stock</span>
                          </label>
                        ) : (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {editingProduct === product.id ? (
                            <>
                              <button
                                onClick={() => setEditingProduct(null)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingProduct(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingProduct(product.id)}
                                className="text-pink-600 hover:text-pink-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
