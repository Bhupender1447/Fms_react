import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoogleMap, PolylineF, MarkerF } from '@react-google-maps/api';
import MapService from "../../services/MapService";
import { BASE_URL } from "../../config";
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

  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        clearInterval(checkGoogle);
      }
    }, 100);
    return () => clearInterval(checkGoogle);
  }, []);

  const fitBounds = useCallback((map, path, markList) => {
    if (!map || !window.google || !window.google.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;
    if (path && path.length > 0) {
      const step = Math.max(1, Math.floor(path.length / 200));
      for (let i = 0; i < path.length; i += step) {
        bounds.extend(path[i]);
        hasPoints = true;
      }
      bounds.extend(path[path.length - 1]);
    }
    if (markList && markList.length > 0) {
      markList.forEach(m => {
        bounds.extend(m);
        hasPoints = true;
      });
    }
    if (hasPoints) {
      map.fitBounds(bounds);
    }
  }, []);

  const drawPolylineOnMap = useCallback((map, path, currentProvider) => {
    if (!map || !window.google || !window.google.maps) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (path && path.length > 0) {
      const polyline = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: currentProvider === 'ptv' ? '#28a745' : '#0055ff',
        strokeOpacity: 0.85,
        strokeWeight: 6,
        map: map
      });
      polylineRef.current = polyline;
    }
  }, []);

  const onLoadMap = useCallback((map) => {
    mapRef.current = map;
    if (routePath && routePath.length > 0) {
      drawPolylineOnMap(map, routePath, provider);
      fitBounds(map, routePath, markers);
    } else if (markers && markers.length > 0) {
      fitBounds(map, [], markers);
    }
  }, [routePath, markers, provider, drawPolylineOnMap, fitBounds]);

  useEffect(() => {
    if (mapRef.current) {
      drawPolylineOnMap(mapRef.current, routePath, provider);
      if (routePath.length > 0 || markers.length > 0) {
        fitBounds(mapRef.current, routePath, markers);
      }
    }
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [routePath, markers, provider, drawPolylineOnMap, fitBounds]);

  const fetchTripAndCalculateRoute = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}api/trip/${tripId}`);
      if (response.data && response.data.status === 'error') {
        throw new Error(response.data.message || "Trip not found.");
      }
      const tripData = response.data.data || response.data;
      if (!tripData || tripData.status === 'error') {
        throw new Error(tripData?.message || "Trip not found.");
      }
      
      const originAddress = tripData.pickup_address || tripData.origin;
      if (!tripData.origin_coords && !originAddress) {
        throw new Error("Trip origin address is missing.");
      }
      const originCoords = tripData.origin_coords 
          ? tripData.origin_coords 
          : await MapService.geocode(originAddress);
          
      const destAddress = tripData.delivery_address || tripData.destination;
      if (!tripData.destination_coords && !destAddress) {
        throw new Error("Trip destination address is missing.");
      }
      const destCoords = tripData.destination_coords 
          ? tripData.destination_coords 
          : await MapService.geocode(destAddress);
      
      let stopCoords = [];
      if (tripData.stops && tripData.stops.length > 0) {
        for (const stop of tripData.stops) {
          if (!stop.coords && !stop.location) continue;
          const coords = stop.coords ? stop.coords : await MapService.geocode(stop.location);
          stopCoords.push(coords);
        }
      }

      const origin = { lat: parseFloat(originCoords.lat), lng: parseFloat(originCoords.lng) };
      const destination = { lat: parseFloat(destCoords.lat), lng: parseFloat(destCoords.lng) };
      const waypoints = stopCoords.map(c => ({ lat: parseFloat(c.lat), lng: parseFloat(c.lng) }));

      const currentMarkers = [origin, ...waypoints, destination];
      setMarkers(currentMarkers);

      const vehicleProfile = provider === 'ptv' ? { type: 'truck' } : { type: 'car' };
      const routeResult = await MapService.getRoute(
          origin, 
          destination, 
          waypoints, 
          vehicleProfile
      );

      const fullRoadPath = MapService.parseRoutePath(routeResult?.path);
      if (fullRoadPath.length < 2) {
        throw new Error("Road route geometry is unavailable or invalid.");
      }

      setRoutePath(fullRoadPath);
    } catch (err) {
      console.error("Error loading trip map:", err);
      setRoutePath([]);
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
          onLoad={onLoadMap}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          {routePath.length > 0 && (
            <PolylineF 
              key={`poly-${provider}-${routePath.length}`}
              path={routePath} 
              options={{ 
                strokeColor: provider === 'ptv' ? '#28a745' : '#0055ff', 
                strokeWeight: 6,
                strokeOpacity: 0.85
              }} 
            />
          )}
          {markers.map((mark, index) => (
            <MarkerF 
              key={`marker-${index}-${mark.lat}-${mark.lng}`} 
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
