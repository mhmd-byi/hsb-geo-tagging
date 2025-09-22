'use client';

import { useState, useEffect } from 'react';
import { Mumineen } from '../lib/types';

interface EditMumineenModalProps {
  isOpen: boolean;
  onClose: () => void;
  mumineen: Mumineen | null;
  onSave: (updatedMumineen: Partial<Mumineen>) => Promise<void>;
}

export default function EditMumineenModal({ isOpen, onClose, mumineen, onSave }: EditMumineenModalProps) {
  const [formData, setFormData] = useState<Partial<Mumineen>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mumineen) {
      setFormData({
        its_id: mumineen.its_id,
        hof_id: mumineen.hof_id,
        full_name: mumineen.full_name,
        age: mumineen.age,
        gender: mumineen.gender,
        sabil_no: mumineen.sabil_no,
        sector: mumineen.sector,
        contact_no: mumineen.contact_no,
        misaq: mumineen.misaq,
        marital_status: mumineen.marital_status,
        address: mumineen.address,
      });
    }
  }, [mumineen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mumineen) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating mumineen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'its_id' || name === 'hof_id' || name === 'age' || name === 'sabil_no' 
        ? (value ? parseInt(value) : undefined)
        : value
    }));
  };

  if (!isOpen || !mumineen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Mumineen Record</h2>
          <p className="text-sm text-gray-600 mt-1">Sabil No: {mumineen.sabil_no}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ITS ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ITS ID *
              </label>
              <input
                type="number"
                name="its_id"
                value={formData.its_id || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* HOF ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HOF ID
              </label>
              <input
                type="number"
                name="hof_id"
                value={formData.hof_id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                min="0"
                max="150"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Sabil No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sabil No *
              </label>
              <input
                type="number"
                name="sabil_no"
                value={formData.sabil_no || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector
              </label>
              <input
                type="text"
                name="sector"
                value={formData.sector || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact No
              </label>
              <input
                type="tel"
                name="contact_no"
                value={formData.contact_no || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Misaq */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Misaq
              </label>
              <select
                name="misaq"
                value={formData.misaq || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Misaq</option>
                <option value="Done">Done</option>
                <option value="Not Done">Not Done</option>
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status
              </label>
              <select
                name="marital_status"
                value={formData.marital_status || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
