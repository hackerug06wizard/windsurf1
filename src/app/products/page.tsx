'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import Categories from '@/components/Categories';
import { Product, CartItem } from '@/types';

const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'feeding', name: 'Baby Feeding' },
  { id: 'clothing', name: 'Baby Clothes' },
  { id: 'toys', name: 'Toys' },
  { id: 'strollers', name: 'Strollers & Car Seats' },
  { id: 'health', name: 'Health & Safety' },
  { id: 'bath', name: 'Bath Time' },
  { id: 'nursery', name: 'Nursery' },
  { id: 'electronics', name: 'Baby Electronics' },
];

// Sample products - in a real app, this would come from an API
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Soft Baby Blanket',
    price: 45000,
    image: '/api/placeholder/300/300',
    description: 'Ultra-soft blanket perfect for newborns',
    category: 'nursery',
    inStock: true,
  },
  {
    id: '2',
    name: 'Baby Feeding Bottle Set',
    price: 35000,
    image: '/api/placeholder/300/300',
    description: 'BPA-free feeding bottles with slow flow nipples',
    category: 'feeding',
    inStock: true,
  },
  {
    id: '3',
    name: 'Educational Baby Toys',
    price: 28000,
    image: '/api/placeholder/300/300',
    description: 'Colorful toys to stimulate baby development',
    category: 'toys',
    inStock: true,
  },
  {
    id: '4',
    name: 'Baby Stroller',
    price: 450000,
    image: '/api/placeholder/300/300',
    description: 'Lightweight and foldable stroller with safety features',
    category: 'strollers',
    inStock: true,
  },
  {
    id: '5',
    name: 'Baby Health Kit',
    price: 65000,
    image: '/api/placeholder/300/300',
    description: 'Essential health and grooming items for babies',
    category: 'health',
    inStock: true,
  },
  {
    id: '6',
    name: 'Baby Bath Set',
    price: 42000,
    image: '/api/placeholder/300/300',
    description: 'Gentle bath products and accessories',
    category: 'bath',
    inStock: true,
  },
  {
    id: '7',
    name: 'Baby Monitor',
    price: 180000,
    image: '/api/placeholder/300/300',
    description: 'Digital baby monitor with night vision',
    category: 'electronics',
    inStock: true,
  },
  {
    id: '8',
    name: 'Baby Clothes Set',
    price: 55000,
    image: '/api/placeholder/300/300',
    description: 'Cotton clothes set for newborns',
    category: 'clothing',
    inStock: true,
  },
];

interface ProductsPageProps {
  onAddToCart?: (product: Product) => void;
}

export default function ProductsPage({ onAddToCart }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    // Load products from localStorage or use sample products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts.length > 0 ? parsedProducts : sampleProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(sampleProducts);
      }
    } else {
      setProducts(sampleProducts);
    }
  }, []);

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // Default cart functionality
      const existingCart = localStorage.getItem('cart');
      const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
      
      const existingItem = cart.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart!');
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            All <span className="text-pink-600">Products</span>
          </h1>
          <p className="text-lg text-gray-600">
            Discover our complete collection of baby and kids products
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {selectedCategory !== 'all' && ` in ${CATEGORIES.find(cat => cat.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('name');
              }}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
