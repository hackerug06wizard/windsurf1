'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOptions {
  age: string;
  size: string;
  color: string;
  category: string;
}

interface ProductFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
}

const AGE_OPTIONS = ['0-6 months', '6-12 months', '1-2 years', '2-4 years', '4-6 years'];
const SIZE_OPTIONS = ['Newborn', '0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-3 years', '3-4 years'];
const COLOR_OPTIONS = ['White', 'Pink', 'Blue', 'Yellow', 'Green', 'Red', 'Purple', 'Gray', 'Black', 'Brown'];

export default function ProductFilter({ filters, onFiltersChange, categories }: ProductFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      age: '',
      size: '',
      color: '',
      category: '',
    });
  };

  const hasActiveFilters = filters.age || filters.size || filters.color || filters.category;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Age Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
            <select
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Ages</option>
              {AGE_OPTIONS.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Sizes</option>
              {SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => handleFilterChange('color', '')}
                className={`p-2 rounded-lg border-2 transition-all ${
                  !filters.color
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                title="All Colors"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
              </button>
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  onClick={() => handleFilterChange('color', color)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    filters.color === color
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  title={color}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: color.toLowerCase() === 'white' ? '#f3f4f6' : 
                                     color.toLowerCase() === 'black' ? '#000000' :
                                     color.toLowerCase() === 'gray' ? '#6b7280' :
                                     color.toLowerCase() === 'brown' ? '#92400e' :
                                     color.toLowerCase()
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
