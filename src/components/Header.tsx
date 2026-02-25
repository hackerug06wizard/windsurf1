'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
}

export default function Header({ cartItems, onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [cartItems]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Mami Papa Babies & Kids"
              className="h-10 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRkI2QzEiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDVjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMtMy0xLjM0LTMtM1MxMC4zNCA3IDEyIDd6bTAgMTQuMmMtMi41IDAtNC43MS0xLjI4LTYtMy4yMi4wMy0xLjk5IDQtMy4wOCA2LTMuMDggMS42NiAwIDMuMjguNjkgNC40NCAxLjc5bC0xLjUgMS41Yy0uNzUtLjc1LTEuNzgtMS4yOS0yLjk0LTEuMjktMi40MiAwLTQuNDQgMi4wMy00LjQ0IDQuNDQgMCAuODkuMjMgMS43Mi42MyAyLjQ0bC0xLjUgMS41Yy0xLjEzLTEuMTYtMS44My0yLjc1LTEuODMtNC40NHoiLz4KPC9zdmc+Cjwvc3ZnPgo=';
              }}
            />
            <span className="text-xl font-bold text-pink-600">Mami Papa Babies & Kids</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-pink-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Cart and Auth */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              href="/auth"
              className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login/Signup</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 text-gray-700 hover:bg-pink-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
