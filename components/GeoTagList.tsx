'use client';

import { useState } from 'react';
import { GeoTag } from '../lib/types';

interface GeoTagListProps {
  geotags: GeoTag[];
  onEdit: (geotag: GeoTag) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function GeoTagList({ geotags, onEdit, onDelete, isLoading = false }: GeoTagListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this geo tag?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (geotags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No records found. Search by sabil number to view geo tags.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {geotags.map((geotag) => (
        <div key={geotag._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{geotag.name}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  Sabil: {geotag.sabilNo}
                </span>
                {geotag.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {geotag.category}
                  </span>
                )}
              </div>
              
              {geotag.description && (
                <p className="text-gray-600 mb-3">{geotag.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium">
                    {geotag.location.latitude.toFixed(6)}, {geotag.location.longitude.toFixed(6)}
                  </p>
                  {geotag.location.address && (
                    <p className="text-sm text-gray-600">{geotag.location.address}</p>
                  )}
                  {(geotag.location.city || geotag.location.country) && (
                    <p className="text-sm text-gray-600">
                      {[geotag.location.city, geotag.location.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(geotag.createdAt || new Date())}
                  </p>
                  {geotag.updatedAt && geotag.updatedAt !== geotag.createdAt && (
                    <>
                      <p className="text-sm text-gray-500 mt-1">Updated</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(geotag.updatedAt)}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {geotag.tags && geotag.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {geotag.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(geotag)}
                className="px-3 py-1 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(geotag._id!)}
                disabled={deletingId === geotag._id}
                className="px-3 py-1 text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === geotag._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
