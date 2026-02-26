'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import Checkout from '@/components/Checkout';
import MarzPayPayment from '@/components/MarzPayPayment';
import WhatsAppButton from '@/components/WhatsAppButton';
import Categories from '@/components/Categories';
import { Product, CartItem } from '@/types';
import { generateId } from '@/lib/utils';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Soft Baby Blanket - Pink',
    price: 45000,
    image: '/api/placeholder/300/300',
    description: 'Ultra-soft baby blanket perfect for newborns',
    category: 'nursery',
    inStock: true,
  },
  {
    id: '2',
    name: 'Baby Diaper Bag - Large',
    price: 85000,
    image: '/api/placeholder/300/300',
    description: 'Spacious diaper bag with multiple compartments',
    category: 'clothing',
    inStock: true,
  },
  {
    id: '3',
    name: 'Baby Romper - Cute Animals',
    price: 35000,
    image: '/api/placeholder/300/300',
    description: 'Comfortable romper with adorable animal prints',
    category: 'clothing',
    inStock: true,
  },
  {
    id: '4',
    name: 'Baby Feeding Bottle Set',
    price: 28000,
    image: '/api/placeholder/300/300',
    description: 'Set of 3 BPA-free feeding bottles',
    category: 'feeding',
    inStock: true,
  },
  {
    id: '5',
    name: 'Baby Toys - Educational Set',
    price: 55000,
    image: '/api/placeholder/300/300',
    description: 'Colorful educational toys for development',
    category: 'toys',
    inStock: true,
  },
  {
    id: '6',
    name: 'Baby Bath Towel - Hooded',
    price: 32000,
    image: '/api/placeholder/300/300',
    description: 'Soft hooded towel for bath time',
    category: 'bath',
    inStock: true,
  },
  {
    id: '7',
    name: 'Baby Stroller - Lightweight',
    price: 250000,
    image: '/api/placeholder/300/300',
    description: 'Lightweight and easy to fold stroller',
    category: 'strollers',
    inStock: true,
  },
  {
    id: '8',
    name: 'Baby Monitor - Digital',
    price: 120000,
    image: '/api/placeholder/300/300',
    description: 'Digital baby monitor with night vision',
    category: 'electronics',
    inStock: true,
  },
  {
    id: '9',
    name: 'Baby Thermometer - Digital',
    price: 45000,
    image: '/api/placeholder/300/300',
    description: 'Accurate digital thermometer for babies',
    category: 'health',
    inStock: true,
  },
  {
    id: '10',
    name: 'Baby Pacifier Set - 3 Pack',
    price: 15000,
    image: '/api/placeholder/300/300',
    description: 'Orthodontic pacifiers for newborns',
    category: 'feeding',
    inStock: true,
  },
  {
    id: '11',
    name: 'Baby Sleep Sack - Pink',
    price: 38000,
    image: '/api/placeholder/300/300',
    description: 'Cozy sleep sack for safe sleeping',
    category: 'clothing',
    inStock: true,
  },
  {
    id: '12',
    name: 'Baby Bath Toys - Floating Set',
    price: 22000,
    image: '/api/placeholder/300/300',
    description: 'Colorful floating toys for bath time fun',
    category: 'bath',
    inStock: true,
  },
];

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMarzPayOpen, setIsMarzPayOpen] = useState(false);
  const [products] = useState<Product[]>(sampleProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { product, quantity: 1 }];
    });
    
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleMarzPayCheckout = () => {
    setIsCartOpen(false);
    setIsMarzPayOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    // Show success message or redirect to thank you page
  };

  const handleMarzPaySuccess = (transactionId: string) => {
    setIsMarzPayOpen(false);
    setCartItems([]);
    // Show success message
    alert(`Payment successful! Transaction ID: ${transactionId}`);
  };

  const handleMarzPayError = (error: string) => {
    alert(`Payment error: ${error}`);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Scroll to products section
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <Header
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
        onCategorySelect={handleCategorySelect}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-pink-600">Mami Papa Babies & Kids</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Premium baby and kids products at affordable prices. Quality you can trust for your little ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Shop Now
            </button>
            <button
              onClick={() => window.open(`https://wa.me/256783468608`, '_blank')}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Chat on WhatsApp
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">Safe and secure payment with Marzpay</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick delivery across Uganda</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="h-12 w-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Quality Products</h3>
              <p className="text-gray-600 text-sm">Premium quality baby products</p>
            </div>
          </div>
        </section>

        
        {/* Products Section */}
        <section id="products">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCategory ? 'Products in Category' : 'Featured Products'}
            </h2>
            <p className="text-gray-600">
              {selectedCategory 
                ? `Showing ${filteredProducts.length} products in selected category`
                : 'Discover our amazing collection of baby and kids products'
              }
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                ← View All Categories
              </button>
            )}
          </div>
          
          <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-gray-300 text-sm">
                Mami Papa Babies & Kids is your trusted partner for quality baby products in Uganda.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-300 text-sm">
                WhatsApp: +256 783 468 608<br />
                Email: info@mamipaba.com
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Payment Methods</h3>
              <p className="text-gray-300 text-sm">
                We accept MTN Mobile Money, Airtel Money, and Bank transfers through Marzpay.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Mami Papa Babies & Kids. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Components */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        onMarzPayCheckout={handleMarzPayCheckout}
      />
      
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onSuccess={handleCheckoutSuccess}
      />
      
      <MarzPayPayment
        isOpen={isMarzPayOpen}
        onClose={() => setIsMarzPayOpen(false)}
        items={cartItems}
        total={cartTotal}
        onSuccess={handleMarzPaySuccess}
        onError={handleMarzPayError}
      />
      
      <WhatsAppButton />
    </div>
  );
}
