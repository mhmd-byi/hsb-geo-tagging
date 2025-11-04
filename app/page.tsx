'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import MumineenList from '../components/MumineenList';
import SearchFilters from '../components/SearchFilters';
import EditMumineenModal from '../components/EditMumineenModal';
import UserManagement from '../components/UserManagement';
import { Mumineen } from '../lib/types';

interface ApiResponse {
  success: boolean;
  data: Mumineen[];
  error?: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [mumineens, setMumineens] = useState<Mumineen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    sabilNo: '',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMumineen, setEditingMumineen] = useState<Mumineen | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);

  const isAdmin = session?.user?.role === 'admin';

  // Fetch mumineens
  const fetchMumineens = async (filters = searchFilters) => {
    // Don't make API call if sabilNo is empty
    if (!filters.sabilNo || filters.sabilNo.trim() === '') {
      setMumineens([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('sabilNo', filters.sabilNo.trim());

      const response = await fetch(`/api/mumineens?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setMumineens(data.data);
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
    fetchMumineens(filters);
  };

  // Handle edit mumineen
  const handleEditMumineen = (mumineen: Mumineen) => {
    // Users can only edit HOF records
    if (!isAdmin && mumineen.its_id !== mumineen.hof_id) {
      alert('You can only edit head of family records');
      return;
    }
    setEditingMumineen(mumineen);
    setIsEditModalOpen(true);
  };

  // Handle delete mumineen (admin only)
  const handleDeleteMumineen = (itsId: number) => {
    if (!isAdmin) {
      alert('Only admins can delete records');
      return;
    }
    handleDelete(itsId.toString());
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
      const response = await fetch(`/api/mumineens/${id}`, {
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

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">HSB Mumineen Search System</h1>
            <p className="text-gray-600">Search and view mumineen records by sabil number</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-gray-700 block">Welcome, {session?.user?.name}</span>
              <span className="text-xs text-gray-500">
                Role: <span className={isAdmin ? 'text-purple-600 font-semibold' : 'text-blue-600'}>
                  {session?.user?.role}
                </span>
              </span>
            </div>
            {isAdmin && (
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                📊 Dashboard
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowUserManagement(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Manage Users
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        {!showForm && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Mumineen Records</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Mumineen
                </button>
              )}
            </div>

            <SearchFilters
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            <MumineenList
              mumineens={mumineens}
              isLoading={isLoading}
              onEdit={handleEditMumineen}
              onDelete={handleDeleteMumineen}
              isAdmin={isAdmin}
            />
          </>
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

        {/* User Management Modal */}
        {showUserManagement && (
          <UserManagement onClose={() => setShowUserManagement(false)} />
        )}
      </div>
    </div>
  );
}
