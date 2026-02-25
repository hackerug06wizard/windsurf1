'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDIwMFYyMDBIMTBWMTAwWiIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K';
              }}
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-pink-600">
                {formatPrice(product.price)}
              </span>
              {product.category && (
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>
            
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className="w-full py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
