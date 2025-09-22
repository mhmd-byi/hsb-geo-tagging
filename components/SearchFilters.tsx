'use client';

import { useState } from 'react';

interface SearchFiltersProps {
  onSearch: (filters: {
    sabilNo: string;
    page: number;
  }) => void;
  isLoading?: boolean;
}

export default function SearchFilters({ onSearch, isLoading = false }: SearchFiltersProps) {
  const [sabilNo, setSabilNo] = useState('');

  const handleSabilNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSabilNo(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ sabilNo, page: 1 });
  };

  const clearFilters = () => {
    setSabilNo('');
    onSearch({ sabilNo: '', page: 1 });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="sabilNo" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Sabil No
          </label>
          <input
            type="text"
            id="sabilNo"
            value={sabilNo}
            onChange={handleSabilNoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter sabil number to search..."
            disabled={isLoading}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || !sabilNo.trim()}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={clearFilters}
            className="w-full px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
