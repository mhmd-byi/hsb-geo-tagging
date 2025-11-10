'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Mumineen } from '../lib/types';

interface EditMumineenModalProps {
  isOpen: boolean;
  onClose: () => void;
  mumineen: Mumineen | null;
  onSave: (updatedMumineen: Partial<Mumineen>) => Promise<void>;
}

// Debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  } as T & { cancel?: () => void };
}

export default function EditMumineenModal({ isOpen, onClose, mumineen, onSave }: EditMumineenModalProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<Partial<Mumineen>>({});
  const [addressFields, setAddressFields] = useState({
    flatNo: '',
    apartmentName: '',
    plotNumber: '',
    area: '',
    landmark: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const isUser = session?.user?.role === 'user';
  const isAdmin = session?.user?.role === 'admin';

  // Initialize address fields when mumineen data loads
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
        google_maps_link: mumineen.google_maps_link,
      });

      // Populate address fields from individual stored values
      setAddressFields({
        flatNo: mumineen.flat_no || '',
        apartmentName: mumineen.apartment_name || '',
        plotNumber: mumineen.plot_number || '',
        area: mumineen.area || '',
        landmark: mumineen.landmark || ''
      });
    }
  }, [mumineen]);

// Debounced address generation
  const debouncedGenerateAddress = useCallback(
    debounce((fields) => {
      const parts = [
        fields.flatNo,
        fields.apartmentName,
        fields.plotNumber,
        fields.area,
        fields.landmark
      ].filter(part => part.trim() !== '');
      
      const generatedAddress = parts.join(', ');
      setFormData(prev => ({ ...prev, address: generatedAddress }));
    }, 300),
    []
  );

  // Handle address field changes
  const handleAddressFieldChange = (field: string, value: string) => {
    const newAddressFields = { ...addressFields, [field]: value };
    setAddressFields(newAddressFields);
    
    // Debounced update of the main address field
    debouncedGenerateAddress(newAddressFields);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending debounce timeouts
    };
  }, []);

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
        google_maps_link: mumineen.google_maps_link,
      });
    }
  }, [mumineen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mumineen) return;

    setIsLoading(true);
    try {
      // Include individual address field values
      const dataToSave = {
        ...formData,
        flat_no: addressFields.flatNo,
        apartment_name: addressFields.apartmentName,
        plot_number: addressFields.plotNumber,
        area: addressFields.area,
        landmark: addressFields.landmark
      };
      await onSave(dataToSave);
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
          <h2 className="text-xl font-semibold text-gray-900">
            {isUser ? 'Update Address' : 'Edit Mumineen Record'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Sabil No: {mumineen.sabil_no}</p>
          {isUser && (
            <p className="text-xs text-blue-600 mt-1">You can only update the address for head of family</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {isUser ? (
            // User role - Only show address field
            <div>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>{formData.full_name}</strong> (ITS: {formData.its_id})
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Updating address will apply to all family members
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                
                {/* Current Address Display */}
                {mumineen.address && (
                  <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs font-medium text-yellow-800 mb-1">Current Address:</p>
                    <p className="text-sm text-yellow-900">{mumineen.address}</p>
                  </div>
                )}
                
                {/* Address fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Flat No */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Flat No. (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressFields.flatNo}
                      onChange={(e) => handleAddressFieldChange('flatNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Flat No."
                    />
                  </div>
                  
                  {/* Apartment Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Apartment Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressFields.apartmentName}
                      onChange={(e) => handleAddressFieldChange('apartmentName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Apartment Name"
                    />
                  </div>
                  
                  {/* Plot Number */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Plot Number *
                    </label>
                    <input
                      type="text"
                      value={addressFields.plotNumber}
                      onChange={(e) => handleAddressFieldChange('plotNumber', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Plot Number"
                    />
                  </div>
                  
                  {/* Area */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Area *
                    </label>
                    <input
                      type="text"
                      value={addressFields.area}
                      onChange={(e) => handleAddressFieldChange('area', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Area"
                    />
                  </div>
                  
                  {/* Landmark */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressFields.landmark}
                      onChange={(e) => handleAddressFieldChange('landmark', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Landmark"
                    />
                  </div>
                </div>
                
                {/* Generated Address */}
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Generated Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Generated address will appear here..."
                    readOnly
                  />
                </div>
              </div>

              {/* Google Maps Link for Users */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  name="google_maps_link"
                  value={formData.google_maps_link || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, google_maps_link: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Paste the Google Maps link for this location</p>
              </div>
            </div>
          ) : (
            // Admin role - Show all fields
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
              
              {/* Address fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Flat No */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Flat No. (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressFields.flatNo}
                    onChange={(e) => handleAddressFieldChange('flatNo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Flat No."
                  />
                </div>
                
                {/* Apartment Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Apartment Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressFields.apartmentName}
                    onChange={(e) => handleAddressFieldChange('apartmentName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Apartment Name"
                  />
                </div>
                
                {/* Plot Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Plot Number *
                  </label>
                  <input
                    type="text"
                    value={addressFields.plotNumber}
                    onChange={(e) => handleAddressFieldChange('plotNumber', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Plot Number"
                  />
                </div>
                
                {/* Area */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Area *
                  </label>
                  <input
                    type="text"
                    value={addressFields.area}
                    onChange={(e) => handleAddressFieldChange('area', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Area"
                  />
                </div>
                
                {/* Landmark */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressFields.landmark}
                    onChange={(e) => handleAddressFieldChange('landmark', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Landmark"
                  />
                </div>
              </div>
              
              {/* Generated Address */}
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Generated Address
                </label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Generated address will appear here..."
                  readOnly
                />
              </div>
            </div>

            {/* Google Maps Link */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Link
              </label>
              <input
                type="url"
                name="google_maps_link"
                value={formData.google_maps_link || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, google_maps_link: e.target.value }))}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            </div>
          )}

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
