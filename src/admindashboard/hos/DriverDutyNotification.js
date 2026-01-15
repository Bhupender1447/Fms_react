import React, { useEffect, useState, useRef } from 'react';

const DriverDutyStatus = () => {
  // State management
  const [drivers, setDrivers] = useState([]);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [driverLocations, setDriverLocations] = useState({});
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [mapStatus, setMapStatus] = useState({
    loading: false,
    error: null,
    mapType: 'roadmap',
  });

  // Refs
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const googleScriptRef = useRef(null);

  // Fetch driver data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDrivers = async () => {
    try {
      const response = await fetch('https://isovia.ca/fms_api/api/getDriversDutyStatus');
      const data = await response.json();

      if (data.status === 'success') {
        // Group records by driver_id and select the latest based on date and time
        const latestDrivers = Object.values(
          data.drivers.reduce((acc, driver) => {
            const current = acc[driver.driver_id];
            const currentTime = current ? new Date(`${current.date} ${current.time}`) : null;
            const newTime = new Date(`${driver.date} ${driver.time}`);
            
            if (!current || newTime > currentTime) {
              acc[driver.driver_id] = {
                ...driver,
                fname: driver.fname || 'Unknown',
                lname: driver.lname || '',
                login_time: driver.login_time || driver.time || '--',
                elapsed_time: driver.elapsed_time || '--',
                time_remaining: driver.time_remaining || '--',
                status: driver.status === '1' ? 'on duty' : 'off duty',
                image_urls: driver.image_urls || [],
                signature_url: driver.signature_url || '',
              };
            }
            return acc;
          }, {})
        );

        setDrivers(latestDrivers);

        // Get addresses for drivers with coordinates
        latestDrivers.forEach(driver => {
          if (driver.latitude && driver.longitude) {
            getAddressFromCoordinates(driver.latitude, driver.longitude, driver.driver_id);
          }
        });

        setShowDutyModal(latestDrivers.some(driver => driver.status === 'on duty'));
      } else {
        console.error('API error:', data.message || 'Unknown error');
        setDrivers([]);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
    }
  };

  // Get address from coordinates
  const getAddressFromCoordinates = async (lat, lng, driverId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBM3VgKsX8mEGsVYpSic7VLNKwEmZ7IABc`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results?.length > 0) {
        setDriverLocations(prev => ({
          ...prev,
          [driverId]: data.results[0].formatted_address,
        }));
      } else {
        setDriverLocations(prev => ({
          ...prev,
          [driverId]: 'Location unavailable',
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setDriverLocations(prev => ({
        ...prev,
        [driverId]: 'Location unavailable',
      }));
    }
  };

  // Fetch driver's specific location
  const fetchDriverLocation = async (driverId) => {
    try {
      const response = await fetch('https://isovia.ca/fms_api/api/locationbyDriver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: 'ci_session=ubqk26tq79t7fkjf1km4km66k7eavhs7; ci_session=gtmq88v6jr8aj7js3pno5a45bqpq8fjf',
        },
        body: `driver_id=${driverId}`,
      });
      const data = await response.json();
      
      // Return the latest record
      if (Array.isArray(data) && data.length > 0) {
        const latest = data.reduce((latest, current) => {
          const latestTime = new Date(`${latest.date} ${latest.time}`);
          const currentTime = new Date(`${current.date} ${current.time}`);
          return currentTime > latestTime ? current : latest;
        });
        return latest;
      }
      return null;
    } catch (error) {
      console.error('Location fetch error:', error);
      return null;
    }
  };

  // Load Google Maps script
  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve();
        return;
      }

      if (googleScriptRef.current) {
        const checkInterval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      googleScriptRef.current = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBM3VgKsX8mEGsVYpSic7VLNKwEmZ7IABc&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps script loaded');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        reject(new Error('Failed to load Google Maps script'));
      };
      document.head.appendChild(script);
    });
  };

  // Initialize map
  const initializeMap = async (lat, lng) => {
    try {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates');
      }

      if (!mapRef.current) {
        throw new Error('Map container not ready');
      }

      const position = { lat: latitude, lng: longitude };

      if (mapInstance.current) {
        mapInstance.current = null;
      }

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        mapTypeId: mapStatus.mapType,
        streetViewControl: false,
      });

      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }

      markerInstance.current = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title: `${selectedDriver?.fname || 'Driver'} ${selectedDriver?.lname || ''}`,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px">
            <h6>${selectedDriver?.fname || 'Driver'} ${selectedDriver?.lname || ''}</h6>
            <p>Driver ID: ${selectedDriver?.driver_id || 'N/A'}</p>
            <p>Status: ${selectedDriver?.status || 'N/A'}</p>
            <p>Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
          </div>
        `,
      });

      markerInstance.current.addListener('click', () => {
        infoWindow.open(mapInstance.current, markerInstance.current);
      });

      setTimeout(() => {
        if (mapInstance.current) {
          window.google.maps.event.trigger(mapInstance.current, 'resize');
          mapInstance.current.setCenter(position);
        }
      }, 500);

      setMapStatus(prev => ({ ...prev, loading: false, error: null }));
    } catch (error) {
      console.error('Map init error:', error);
      setMapStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to initialize map',
      }));
    }
  };

  // Handle view location
  const handleViewLocation = async (driver) => {
    setSelectedDriver(driver);
    setMapStatus(prev => ({ ...prev, loading: true, error: null }));
    setShowMapModal(true);

    try {
      // Always fetch the latest location from the API
      const locationData = await fetchDriverLocation(driver.driver_id);
      if (locationData?.latitude && locationData?.longitude) {
        const latitude = parseFloat(locationData.latitude);
        const longitude = parseFloat(locationData.longitude);
        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error('Invalid coordinates provided');
        }

        await loadGoogleMaps();
        await initializeMap(latitude, longitude);
        // Update driver location in state
        setDrivers(prev =>
          prev.map(d =>
            d.driver_id === driver.driver_id
              ? { ...d, latitude: locationData.latitude, longitude: locationData.longitude }
              : d
          )
        );
        // Fetch address for the new coordinates
        getAddressFromCoordinates(locationData.latitude, locationData.longitude, driver.driver_id);
      } else {
        throw new Error('No location data available');
      }
    } catch (error) {
      console.error('Location error:', error);
      setMapStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load location',
      }));
    }
  };

  // Toggle map type
  const toggleMapType = () => {
    const newType = mapStatus.mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapStatus(prev => ({ ...prev, mapType: newType }));
    
    if (mapInstance.current) {
      mapInstance.current.setMapTypeId(newType);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDrivers();
    const interval = setInterval(fetchDrivers, 1800000); // 30 mins
    
    return () => {
      clearInterval(interval);
      if (markerInstance.current) markerInstance.current.setMap(null);
      if (mapInstance.current) mapInstance.current = null;
      if (googleScriptRef.current) {
        const scripts = document.head.getElementsByTagName('script');
        for (let script of scripts) {
          if (script.src.includes('maps.googleapis.com')) {
            document.head.removeChild(script);
            break;
          }
        }
      }
    };
  }, [fetchDrivers]);

  // Show duty modal when drivers on duty
  useEffect(() => {
    const modalEl = document.getElementById('dutyModal');
    if (modalEl && showDutyModal) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
      return () => modal.hide();
    }
  }, [showDutyModal]);

  return (
    <div className="content-wrapper p-4">
      <h2 className="mb-4">Drivers On Duty</h2>

      {/* Drivers Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Driver ID</th>
              <th>Name</th>
              <th>Login Time</th>
              <th>On Duty</th>
              <th>Time Left</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
              <th>Images</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">No active drivers</td>
              </tr>
            ) : (
              drivers.map(driver => (
                <tr key={driver.driver_id}>
                  <td>{driver.driver_id}</td>
                  <td>{driver.fname} {driver.lname}</td>
                  <td>{driver.login_time}</td>
                  <td>{driver.elapsed_time}</td>
                  <td>{driver.time_remaining}</td>
                  <td>
                    <span className={`badge ${driver.status === 'on duty' ? 'bg-success' : 'bg-warning'}`}>
                      {driver.status}
                    </span>
                  </td>
                  <td>
                    {driverLocations[driver.driver_id] || 
                    (driver.latitude && driver.longitude ? 'Loading address...' : 'No location')}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewLocation(driver)}
                      disabled={mapStatus.loading && selectedDriver?.driver_id === driver.driver_id}
                    >
                      {mapStatus.loading && selectedDriver?.driver_id === driver.driver_id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Loading...
                        </>
                      ) : 'View Map'}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {driver.image_urls.map((img, i) => (
                        <img
                          key={i}
                          src={`https://isovia.ca/fms_api/${img}`}
                          alt="Trip"
                          onClick={() => {
                            setZoomImage(`https://isovia.ca/fms_api/${img}`);
                            setShowZoomModal(true);
                          }}
                          className="img-thumbnail cursor-pointer"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    {driver.signature_url && (
                      <img
                        src={`https://isovia.ca/fms_api/${driver.signature_url}`}
                        alt="Signature"
                        onClick={() => {
                          setZoomImage(`https://isovia.ca/fms_api/${driver.signature_url}`);
                          setShowZoomModal(true);
                        }}
                        className="img-thumbnail cursor-pointer bg-white"
                        style={{ width: '100px', height: '40px', objectFit: 'contain' }}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Duty Status Modal */}
      <div className="modal fade" id="dutyModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Active Drivers Notification</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {drivers.map(driver => (
                <div key={driver.driver_id} className="mb-3 border-bottom pb-2">
                  <h6>{driver.fname} {driver.lname} (ID: {driver.driver_id})</h6>
                  <div className="row">
                    <div className="col-6">
                      <p><strong>Status:</strong> <span className="badge bg-success">{driver.status}</span></p>
                      <p><strong>Login:</strong> {driver.login_time}</p>
                    </div>
                    <div className="col-6">
                      <p><strong>On Duty:</strong> {driver.elapsed_time}</p>
                      <p><strong>Remaining:</strong> {driver.time_remaining}</p>
                    </div>
                  </div>
                  <p><strong>Location:</strong> {driverLocations[driver.driver_id] || 'Unknown'}</p>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showZoomModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 bg-transparent">
              <div className="modal-header border-0">
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowZoomModal(false)}
                />
              </div>
              <div className="modal-body text-center">
                <img
                  src={zoomImage}
                  alt="Zoomed"
                  className="img-fluid"
                  style={{ maxHeight: '80vh', borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Map Modal */}
      {showMapModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {selectedDriver?.fname || 'Driver'} {selectedDriver?.lname || ''}'s Location
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowMapModal(false)}
                />
              </div>
              <div className="modal-body p-0 position-relative">
                {mapStatus.loading && (
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
                    <div className="mt-2">Loading map...</div>
                  </div>
                )}
                {mapStatus.error && (
                  <div className="alert alert-danger m-3">
                    {mapStatus.error}
                    <button 
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleViewLocation(selectedDriver)}
                    >
                      Retry
                    </button>
                  </div>
                )}
                <div 
                  ref={mapRef}
                  style={{ 
                    height: '500px', 
                    width: '100%',
                    filter: mapStatus.loading ? 'blur(2px)' : 'none',
                    opacity: mapStatus.loading ? 0.7 : 1,
                  }}
                />
                <div className="p-3 border-top">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Coordinates:</strong> {selectedDriver?.latitude || 'N/A'}, {selectedDriver?.longitude || 'N/A'}
                      </p>
                      <p className="mb-0">
                        <strong>Address:</strong> {driverLocations[selectedDriver?.driver_id] || 'Loading...'}
                      </p>
                    </div>
                    <div className="col-md-6 text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={toggleMapType}
                      >
                        {mapStatus.mapType === 'roadmap' ? 'Satellite View' : 'Map View'}
                      </button>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewLocation(selectedDriver)}
                        disabled={mapStatus.loading}
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowMapModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDutyStatus;