import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import MapService from '../services/MapService';
import { GOOGLE_MAPS_LIBRARIES } from '../mapConfig';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 43.710513,
  lng: -79.828695
};

const TripMap = () => {
  // Your provided JSON trip data
  const tripData = {
    "accountName": "Isovia (IFM TMS)",
    "tripStatus": "Planned",
    "modifiedOn": "2025-02-10T18:20:46+00:00",
    "tripDistance": 3172.828,
    "tripDriveDuration": 3114.217,
    "tripDuration": 3294.217,
    "tripCost": 6400.55,
    "stops": [
      {
        "location": {
          "address": { "streetAddress": "26 Jersey Street", "city": "Boston", "state": "MA", "zip": "02215" },
          "coords": { "lat": "42.346689", "lon": "-71.09886" },
          "label": "Fenway Park"
        }
      },
      {
        "location": {
          "address": { "streetAddress": "116 Federal Street", "city": "Pittsburgh", "state": "PA", "zip": "15212" },
          "coords": { "lat": "40.448111", "lon": "-80.003865" },
          "label": "PNC Park"
        }
      },
      {
        "location": {
          "address": { "streetAddress": "4900 Marie P. DeBartolo Way", "city": "Santa Clara", "state": "CA", "zip": "95054" },
          "coords": { "lat": "37.403658", "lon": "-121.96851" },
          "label": "Levi's Stadium"
        }
      }
    ]
  };

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        clearInterval(checkGoogle);
      }
    }, 100);
    return () => clearInterval(checkGoogle);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [routePath, setRoutePath] = useState([]);
  const [provider, setProvider] = useState('google');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setIsLoading(true);
      try {
        const stopsCoords = tripData.stops.map(stop => ({
          lat: parseFloat(stop.location.coords.lat),
          lng: parseFloat(stop.location.coords.lon),
          label: stop.location.label
        }));
        
        if (stopsCoords.length >= 2) {
          const origin = stopsCoords[0];
          const destination = stopsCoords[stopsCoords.length - 1];
          const waypoints = stopsCoords.slice(1, stopsCoords.length - 1);
          
          const vehicleProfile = provider === 'ptv' ? { type: 'truck' } : null;
          const routeResult = await MapService.getRoute(origin, destination, waypoints, vehicleProfile);
          
          let parsedPath = [];
          if (routeResult.path) {
            if (typeof routeResult.path === 'string') {
              try { parsedPath = JSON.parse(routeResult.path); } catch (e) {}
            } else if (Array.isArray(routeResult.path)) {
              parsedPath = routeResult.path;
            }
          }
          
          setMarkers(stopsCoords);
          if (parsedPath.length > 0) {
            setRoutePath(parsedPath.map(p => ({ 
              lat: parseFloat(p.lat !== undefined ? p.lat : (p[0] !== undefined ? p[0] : p.latitude)), 
              lng: parseFloat(p.lng !== undefined ? p.lng : (p[1] !== undefined ? p[1] : p.longitude)) 
            })));
          } else {
            setRoutePath(stopsCoords);
          }
        }
      } catch (err) {
        console.error("Error generating live route: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (showModal) {
      fetchRoute();
    }
  }, [provider, showModal]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2>Trip Details</h2>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}
        border="1"
      >
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Status</th>
            <th>Modified On</th>
            <th>Distance</th>
            <th>Drive Duration</th>
            <th>Total Duration</th>
            <th>Cost</th>
            <th># Stops</th>
            <th>Map</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{tripData.accountName}</td>
            <td>{tripData.tripStatus}</td>
            <td>{new Date(tripData.modifiedOn).toLocaleString()}</td>
            <td>{tripData.tripDistance}</td>
            <td>{tripData.tripDriveDuration}</td>
            <td>{tripData.tripDuration}</td>
            <td>{tripData.tripCost}</td>
            <td>{tripData.stops.length}</td>
            <td>
              <button onClick={openModal} className="btn btn-primary btn-sm">View Map</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Popup Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle} className="position-relative">
            
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <label className="fw-bold m-0">Provider:</label>
                <select className="form-select form-select-sm" value={provider} onChange={(e) => setProvider(e.target.value)}>
                  <option value="google">Google Maps (Car)</option>
                  <option value="ptv">PTV Maps (Truck)</option>
                </select>
                {isLoading && <div className="spinner-border spinner-border-sm text-primary ms-2" role="status"></div>}
              </div>
              <button onClick={closeModal} className="btn btn-secondary btn-sm">
                Close Map
              </button>
            </div>

            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={markers.length > 0 ? markers[0] : defaultCenter}
                zoom={4}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false
                }}
              >
                {routePath.length > 1 && (
                  <Polyline 
                    key={routePath.length + provider}
                    path={routePath} 
                    options={{ 
                      strokeColor: provider === 'ptv' ? '#28a745' : '#0055ff', 
                      strokeWeight: 5,
                      strokeOpacity: 0.8
                    }} 
                  />
                )}
                {markers.map((mark, index) => (
                  <Marker 
                    key={index} 
                    position={mark} 
                    label={{
                      text: index === 0 ? "A" : index === markers.length - 1 ? "B" : index.toString(),
                      color: "white"
                    }} 
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="d-flex justify-content-center align-items-center bg-light" style={containerStyle}>
                Loading Map...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '1000px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
};

export default TripMap;
