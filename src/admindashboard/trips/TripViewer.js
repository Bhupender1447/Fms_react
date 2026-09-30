import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import MapService from "../../services/MapService";
import { BASE_URL } from "../../config";
import { GOOGLE_MAPS_LIBRARIES } from "../../mapConfig";
import "bootstrap/dist/css/bootstrap.min.css"; 

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 43.710513,
  lng: -79.828695
};

const TripViewer = () => {
  const { tripId } = useParams();
  const [error, setError] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState('google');

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

  const fetchTripAndCalculateRoute = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}api/trip/${tripId}`);
      const tripData = response.data;
      
      const originCoords = tripData.origin_coords 
          ? tripData.origin_coords 
          : await MapService.geocode(tripData.pickup_address || tripData.origin);
          
      const destCoords = tripData.destination_coords 
          ? tripData.destination_coords 
          : await MapService.geocode(tripData.delivery_address || tripData.destination);
      
      let stopCoords = [];
      if (tripData.stops && tripData.stops.length > 0) {
        for (const stop of tripData.stops) {
          const coords = stop.coords ? stop.coords : await MapService.geocode(stop.location);
          stopCoords.push(coords);
        }
      }

      const origin = { lat: parseFloat(originCoords.lat), lng: parseFloat(originCoords.lng) };
      const destination = { lat: parseFloat(destCoords.lat), lng: parseFloat(destCoords.lng) };
      const waypoints = stopCoords.map(c => ({ lat: parseFloat(c.lat), lng: parseFloat(c.lng) }));

      const vehicleProfile = provider === 'ptv' ? { type: 'truck' } : null;
      const routeResult = await MapService.getRoute(
          origin, 
          destination, 
          waypoints, 
          vehicleProfile
      );

      setMarkers([origin, ...waypoints, destination]);
      let parsedPath = [];
      if (routeResult.path) {
        if (typeof routeResult.path === 'string') {
          try { parsedPath = JSON.parse(routeResult.path); } catch (e) {}
        } else if (Array.isArray(routeResult.path)) {
          parsedPath = routeResult.path;
        }
      }
      
      if (parsedPath.length > 0) {
        setRoutePath(parsedPath.map(p => ({ 
          lat: parseFloat(p.lat !== undefined ? p.lat : (p[0] !== undefined ? p[0] : p.latitude)), 
          lng: parseFloat(p.lng !== undefined ? p.lng : (p[1] !== undefined ? p[1] : p.longitude)) 
        })));
      } else {
          setRoutePath([origin, ...waypoints, destination]);
      }
    } catch (err) {
      console.error("Error loading trip map:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchTripAndCalculateRoute();
    }
  }, [tripId, provider]);

  if (error) {
    return <div className="alert alert-danger m-3">Error loading map: {error.message || "Unknown error"}</div>;
  }

  return (
    <div className="content-wrapper p-0 m-0 position-relative">
      
      {/* Absolute positioned Provider Switch over Map */}
      <div className="position-absolute top-0 start-0 m-3 p-3 bg-white shadow rounded z-3" style={{ zIndex: 1000 }}>
        <h5 className="mb-2">Trip #{tripId} Viewer</h5>
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold m-0 text-nowrap">Map Provider:</label>
          <select className="form-select form-select-sm" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="google">Google Maps (Car)</option>
            <option value="ptv">PTV Maps (Truck)</option>
          </select>
        </div>
      </div>

      {isLoading || !isLoaded ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary me-2" role="status"></div>
          <p className="text-lg font-weight-bold m-0">Loading Route...</p>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markers.length > 0 ? markers[0] : defaultCenter}
          zoom={5}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          {routePath.length > 0 && (
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
      )}
    </div>
  );
};

export default TripViewer;
