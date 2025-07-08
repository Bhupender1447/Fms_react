import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DriverHOS = () => {
  const { id } = useParams();
  const [hosData, setHosData] = useState([]);
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date()); // Track current time for ongoing trips

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const hosResponse = await axios.get(`https://isovia.ca/fms_api/api/list_trips?driver_id=${id}`);
        if (hosResponse.data.status !== 'success') throw new Error(hosResponse.data.message);
        const hosResults = hosResponse.data.data;
        setHosData(hosResults);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Calculate remaining hours for a trip (8.5 hour shift)
  const calculateRemainingHours = (trip) => {
    const shiftHours = 8.5; // 8 hours 30 minutes
    const loginTime = new Date(trip.login_time);
    
    if (trip.status === 'on') {
      const elapsedMs = currentTime - loginTime;
      const elapsedHours = elapsedMs / (1000 * 60 * 60);
      const remaining = shiftHours - elapsedHours;
      
      return remaining > 0 
        ? `${remaining.toFixed(2)} hrs` 
        : <span className="text-danger">-{Math.abs(remaining).toFixed(2)} hrs</span>;
    }
    
    if (trip.logout_time) {
      const logoutTime = new Date(trip.logout_time);
      const elapsedMs = logoutTime - loginTime;
      const elapsedHours = elapsedMs / (1000 * 60 * 60);
      const remaining = shiftHours - elapsedHours;
      
      return remaining > 0 
        ? `${remaining.toFixed(2)} hrs` 
        : <span className="text-danger">-{Math.abs(remaining).toFixed(2)} hrs</span>;
    }
    
    return 'N/A';
  };

  const fetchTripDetails = async (tripId) => {
    setLoadingDetails(true);
    try {
      const tripResponse = await axios.get(
        `https://isovia.ca/fms_api/api/getTripDetailsById/${tripId}`
      );
      if (tripResponse.data.status === 'success') {
        setSelectedTripDetails(tripResponse.data.data);
      } else {
        throw new Error(tripResponse.data.message || 'Failed to load trip details');
      }
    } catch (err) {
      setError(`Error loading trip details: ${err.message}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleTripRowClick = (trip) => {
    fetchTripDetails(trip.trip_id);
  };

  const handleImageClick = (url) => {
    setZoomImage(`https://isovia.ca/fms_api/${url}`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setZoomImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  const formatValue = (value) => {
    if (value instanceof Object) return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value || '-';
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mx-3 mt-4">
      <i className="fas fa-exclamation-circle me-2"></i>
      Error loading data: {error}
    </div>
  );

  return (
    <>
      <div className="content-wrapper pt-3" style={{ minHeight: 440 }}>
        <div className="row g-4">

          {/* Header */}
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-user-clock me-2 text-primary"></i>
                  Driver HOS & Trip Details
                </h1>
                <small className="text-muted">Driver ID: {id}</small>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Export
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-print me-2"></i>Print
                </button>
              </div>
            </div>
            <hr className="mt-3" />
          </div>

          {/* Quick Stats */}
          <div className="col-12">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-muted mb-3">Total Trips</h5>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle p-3 me-3">
                        <i className="fas fa-route fa-2x"></i>
                      </div>
                      <h2 className="mb-0">{hosData?.length || 0}</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-muted mb-3">Recent Status</h5>
                    <div className="d-flex align-items-center">
                      <div className="bg-success text-white rounded-circle p-3 me-3">
                        <i className="fas fa-check-circle fa-2x"></i>
                      </div>
                      <div>
                        <h4 className="mb-0 text-capitalize">
                          {hosData?.[0]?.status || 'N/A'}
                        </h4>
                        <small className="text-muted">Last trip status</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-muted mb-3">Vehicle Info</h5>
                    <div className="d-flex align-items-center">
                      <div className="bg-info text-white rounded-circle p-3 me-3">
                        <i className="fas fa-truck fa-2x"></i>
                      </div>
                      <div>
                        <h4 className="mb-0">
                          {selectedTripDetails?.vehicle_number || 'N/A'}
                        </h4>
                        <small className="text-muted">Assigned vehicle</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HOS Table */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0">
                  <i className="fas fa-table me-2 text-primary"></i>
                  Hours of Service (HOS) Records
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      {hosData.length > 0 && (
                        <tr>
                          <th>Trip ID</th>
                          <th>Login Time</th>
                          <th>Logout Time</th>
                          <th>Status</th>
                          <th>Remaining Hours</th> {/* Added column */}
                           <th>Pre Trip Inspection</th> 
                          <th>Images</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {hosData.map((trip) => (
                        <tr
                          key={trip.trip_id}
                          onClick={() => handleTripRowClick(trip)}
                          className={selectedTripDetails?.trip_id === trip.trip_id ? 'table-active' : ''}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{trip.trip_id}</td>
                          <td>{trip.login_time}</td>
                          <td>{trip.logout_time || 'N/A'}</td>
                          <td>
                            <span className={`badge ${trip.status === 'on' ? 'bg-success' : 'bg-secondary'}`}>
                              {trip.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {calculateRemainingHours(trip)}
                          </td>
                            <td>
    {trip.pre_trip_inspection === 'yes' || trip.pre_trip_inspection === true ? (
      <span className="badge bg-success">Yes</span>
    ) : trip.pre_trip_inspection === 'no' || trip.pre_trip_inspection === false ? (
      <span className="badge bg-danger">No</span>
    ) : (
      <span className="text-muted">N/A</span>
    )}
  </td>
                          <td>
                            {trip.image_urls && trip.image_urls.length > 0 ? (
                              <div className="d-flex">
                                {trip.image_urls.slice(0, 2).map((url, index) => (
                                  <img
                                    key={index}
                                    src={`https://isovia.ca/fms_api/${url}`}
                                    alt={`Trip ${trip.trip_id} image ${index + 1}`}
                                    className="img-thumbnail me-1"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'zoom-in' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleImageClick(url);
                                    }}
                                  />
                                ))}
                                {trip.image_urls.length > 2 && (
                                  <span className="ms-1">+{trip.image_urls.length - 2} more</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted">No images</span>
                            )}
                          </td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-secondary">
                              <i className="fas fa-ellipsis-h"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-map-marked-alt me-2 text-primary"></i>
                  Detailed Trip Information
                </h5>
                {loadingDetails && (
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
              {selectedTripDetails ? (
                <div className="card-body">
                  <div className="row g-4">
                    {Object.entries(selectedTripDetails).map(([key, value]) => {
                      if (key === 'image_urls') return null;
                      return (
                        <div className="col-md-4" key={key}>
                          <div className="border-bottom pb-2">
                            <small className="text-muted text-uppercase">{formatKey(key)}</small>
                            <div className="fw-medium mt-1">{formatValue(value)}</div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Trip Image Gallery */}
                    {selectedTripDetails.image_urls && selectedTripDetails.image_urls.length > 0 && (
                      <div className="col-12 mt-4">
                        <h6 className="text-muted text-uppercase mb-3">Trip Images</h6>
                        <div className="d-flex flex-wrap gap-3">
                          {selectedTripDetails.image_urls.map((url, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={`https://isovia.ca/fms_api/${url}`}
                                alt={`Trip ${selectedTripDetails.trip_id} image ${index + 1}`}
                                className="img-thumbnail"
                                style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'zoom-in' }}
                                onClick={() => handleImageClick(url)}
                              />
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card-body">
                  <div className="alert alert-info mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Click on a trip record above to view detailed information
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 bg-transparent">
              <div className="modal-body text-center p-0">
                <img src={zoomImage} alt="Zoom" className="img-fluid rounded" />
              </div>
              <div className="text-center mt-2">
                <button className="btn btn-light btn-sm" onClick={() => setZoomImage(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverHOS;