import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';

const DocumentChecklist = ({ driverId }) => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}api/checkDocumentList?id=${driverId}`
        );

        if (response.data.status === 'success') {
          setDocumentData(response.data.data[0]);
        } else {
          setError('Failed to fetch document data');
        }
      } catch (err) {
        setError('Error fetching document data: ' + err.message);
        console.error('Error fetching document data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchDocumentData();
    }
  }, [driverId]);

  const getStatusBadge = (status) => {
    const badgeClasses = {
      expired: 'bg-red-500',
      expiring: 'bg-yellow-500',
      valid: 'bg-green-500',
      default: 'bg-gray-500'
    };

    const className = badgeClasses[status] || badgeClasses.default;
    return (
      <span className={`px-2 py-1 rounded text-white text-xs ${className}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getDaysText = (remainingDays) => {
    if (remainingDays === 0) return 'Expired today';
    if (remainingDays === 1) return '1 day remaining';
    if (remainingDays > 1) return `${remainingDays} days remaining`;
    return 'Expired';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No document data found
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Document Checklist - {documentData.name}
        </h3>
        <p className="text-sm text-gray-600">Driver ID: {documentData.driver_id}</p>
      </div>

      {/* Documents List */}
      <div className="p-4">
        {documentData.documents && documentData.documents.length > 0 ? (
          <div className="space-y-3">
            {documentData.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{doc.document_type}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>
                      <strong>Expiry:</strong> {new Date(doc.expiry_date).toLocaleDateString()}
                    </span>
                    <span>
                      <strong>Status:</strong> {getDaysText(doc.remaining_days)}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(doc.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No documents found for this driver
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Total Documents: {documentData.documents?.length || 0}
          </span>
          <span className="text-gray-600">
            Expired: {documentData.documents?.filter(doc => doc.status === 'expired').length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentChecklist;