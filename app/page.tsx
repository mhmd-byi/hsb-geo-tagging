'use client';

import { useState, useEffect } from 'react';
import GeoTagForm from '../components/GeoTagForm';
import MumineenList from '../components/MumineenList';
import SearchFilters from '../components/SearchFilters';
import EditMumineenModal from '../components/EditMumineenModal';
import Pagination from '../components/Pagination';
import { Mumineen, GeoTag, CreateGeoTagData, UpdateGeoTagData } from '../lib/types';

interface ApiResponse {
  success: boolean;
  data: Mumineen[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export default function Home() {
  const [mumineens, setMumineens] = useState<Mumineen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGeotag, setEditingGeotag] = useState<GeoTag | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    sabilNo: '',
    page: 1
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMumineen, setEditingMumineen] = useState<Mumineen | null>(null);

  // Fetch mumineens
  const fetchMumineens = async (filters = searchFilters) => {
    // Don't make API call if sabilNo is empty
    if (!filters.sabilNo || filters.sabilNo.trim() === '') {
      setMumineens([]);
      setCurrentPage(1);
      setTotalPages(1);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('sabilNo', filters.sabilNo.trim());
      params.append('page', filters.page.toString());
      params.append('limit', '10');

      const response = await fetch(`/api/mumineens?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setMumineens(data.data);
        if (data.pagination) {
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.pages);
        }
      } else {
        console.error('Error fetching mumineens:', data.error);
      }
    } catch (error) {
      console.error('Error fetching mumineens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount - don't fetch anything initially
  useEffect(() => {
    // Don't fetch any data initially - only show results when searching
  }, []);

  // Handle search filter changes
  const handleSearch = (filters: { sabilNo: string; page: number }) => {
    setSearchFilters(filters);
    setCurrentPage(filters.page);
    fetchMumineens(filters);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    const newFilters = { ...searchFilters, page };
    setSearchFilters(newFilters);
    setCurrentPage(page);
    fetchMumineens(newFilters);
  };

  // Handle form submission
  const handleSubmit = async (data: CreateGeoTagData | UpdateGeoTagData) => {
    try {
      setIsSubmitting(true);
      
      const url = editingGeotag ? `/api/geotags/${editingGeotag._id}` : '/api/geotags';
      const method = editingGeotag ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        setEditingGeotag(null);
        // Only refresh if there's an active search
        if (searchFilters.sabilNo.trim()) {
          fetchMumineens(searchFilters);
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while saving the geo tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit geotag
  const handleEditGeotag = (geotag: GeoTag) => {
    setEditingGeotag(geotag);
    setShowForm(true);
  };

  // Handle edit mumineen
  const handleEditMumineen = (mumineen: Mumineen) => {
    setEditingMumineen(mumineen);
    setIsEditModalOpen(true);
  };

  // Handle save mumineen
  const handleSaveMumineen = async (updatedMumineen: Partial<Mumineen>) => {
    if (!editingMumineen) return;

    try {
      const response = await fetch(`/api/mumineens/${editingMumineen._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMumineen),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the current search results
        if (searchFilters.sabilNo.trim()) {
          fetchMumineens(searchFilters);
        }
        setIsEditModalOpen(false);
        setEditingMumineen(null);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating mumineen:', error);
      alert('An error occurred while updating the record');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/geotags/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Only refresh if there's an active search
        if (searchFilters.sabilNo.trim()) {
          fetchMumineens(searchFilters);
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting geo tag:', error);
      alert('An error occurred while deleting the geo tag');
    }
  };

  // Handle form cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingGeotag(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HSB Mumineen Search System</h1>
          <p className="text-gray-600">Search and view mumineen records by sabil number</p>
        </div>

        {!showForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Mumineen Records</h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Geo Tag
              </button>
            </div>

            <SearchFilters
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            <MumineenList
              mumineens={mumineens}
              isLoading={isLoading}
              onEdit={handleEditMumineen}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <GeoTagForm
              geotag={editingGeotag || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Edit Mumineen Modal */}
        <EditMumineenModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingMumineen(null);
          }}
          mumineen={editingMumineen}
          onSave={handleSaveMumineen}
        />
      </div>
    </div>
  );
}
