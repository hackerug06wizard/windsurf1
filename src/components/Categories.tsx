'use client';

import { useState } from 'react';
import { Baby, Shirt, Droplet, Car, Heart, Camera, Stethoscope, Gamepad2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

const categories: Category[] = [
  {
    id: 'feeding',
    name: 'Baby Feeding',
    icon: <Droplet className="h-6 w-6" />,
    count: 12,
    color: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
  },
  {
    id: 'clothing',
    name: 'Baby Clothes',
    icon: <Shirt className="h-6 w-6" />,
    count: 24,
    color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  },
  {
    id: 'toys',
    name: 'Toys',
    icon: <Gamepad2 className="h-6 w-6" />,
    count: 18,
    color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
  },
  {
    id: 'strollers',
    name: 'Strollers & Car Seats',
    icon: <Car className="h-6 w-6" />,
    count: 8,
    color: 'bg-green-100 text-green-600 hover:bg-green-200',
  },
  {
    id: 'health',
    name: 'Health & Safety',
    icon: <Stethoscope className="h-6 w-6" />,
    count: 15,
    color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  },
  {
    id: 'bath',
    name: 'Bath Time',
    icon: <Heart className="h-6 w-6" />,
    count: 10,
    color: 'bg-red-100 text-red-600 hover:bg-red-200',
  },
  {
    id: 'nursery',
    name: 'Nursery',
    icon: <Baby className="h-6 w-6" />,
    count: 20,
    color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
  },
  {
    id: 'electronics',
    name: 'Baby Electronics',
    icon: <Camera className="h-6 w-6" />,
    count: 6,
    color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
  },
];

interface CategoriesProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export default function Categories({ selectedCategory, onCategorySelect }: CategoriesProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-300 transform
              ${selectedCategory === category.id 
                ? 'border-pink-500 shadow-lg scale-105' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
              ${category.color}
            `}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-white rounded-full shadow-sm">
                {category.icon}
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-sm text-gray-800 mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {category.count} products
                </p>
              </div>
            </div>
            
            {hoveredCategory === category.id && (
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-gray-800">View Products</span>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing all categories
          </p>
          <button
            onClick={() => onCategorySelect?.('')}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}
