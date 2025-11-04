'use client';

import { Mumineen } from '../lib/types';

interface MumineenListProps {
  mumineens: Mumineen[];
  isLoading?: boolean;
  onEdit: (mumineen: Mumineen) => void;
  onDelete: (itsId: number) => void;
  isAdmin?: boolean;
}

export default function MumineenList({ mumineens, isLoading = false, onEdit, onDelete, isAdmin = true }: MumineenListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (mumineens.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No mumineen found. Search by sabil number to view records.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ITS ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HOF ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age & Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sector
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marital Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Misaq
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Musaed Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mumineens.map((mumineen) => (
              mumineen.isDeleted ? null : (
                <tr key={mumineen._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {mumineen.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mumineen.its_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mumineen.hof_id || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    {mumineen.age && (
                      <span className="text-sm text-gray-900">
                        {mumineen.age}
                      </span>
                    )}
                    {mumineen.gender && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
                        mumineen.gender === 'Male' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {mumineen.gender}
                      </span>
                    )}
                    {!mumineen.age && !mumineen.gender && (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mumineen.sector || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mumineen.contact_no || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mumineen.marital_status || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {mumineen.misaq ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mumineen.misaq === 'Done' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mumineen.misaq}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="break-words" title={mumineen.address || ''}>
                    {mumineen.address || '-'}
                  </div>
                  {mumineen.google_maps_link && (
                    <a 
                      href={mumineen.google_maps_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      View on Maps
                    </a>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    {mumineen.musaed_name && (
                      <div className="text-sm font-medium text-gray-900">
                        {mumineen.musaed_name}
                      </div>
                    )}
                    {mumineen.musaed_contact && (
                      <div className="text-sm text-gray-600">
                        {mumineen.musaed_contact}
                      </div>
                    )}
                    {!mumineen.musaed_name && !mumineen.musaed_contact && (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Show lock icon if verified */}
                  {mumineen.verified ? (
                    <div className="flex flex-col items-center">
                      <div className="text-green-600" title="Verified">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-600 mt-1">
                        Verified by
                      </span>
                      <span className="text-xs font-semibold text-green-700">
                        {mumineen.verified_by}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Edit button - Users can only edit HOF records */}
                      {(isAdmin || mumineen.its_id === mumineen.hof_id) && (
                        <button
                          onClick={() => onEdit(mumineen)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                          title={isAdmin ? 'Edit record' : 'Update address'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {/* Delete button - Admin only */}
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(mumineen.its_id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors ml-2"
                          title="Delete record"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                      {/* Show indicator for non-HOF records for users */}
                      {!isAdmin && mumineen.its_id !== mumineen.hof_id && (
                        <span className="text-xs text-gray-400">Family member</span>
                      )}
                    </>
                  )}
                </td>
              </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
