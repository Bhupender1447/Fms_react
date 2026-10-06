import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import MapService from '../../services/MapService';
import { GOOGLE_MAPS_LIBRARIES } from '../../mapConfig';
import './FmsMap.css';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 43.710513,
  lng: -79.828695
};

/**
 * FmsMap - Unified Map component providing a professional layout:
 * Sidebar for route details + Map display.
 * Supports Google Maps and PTV via MapService abstraction.
 */
const FmsMap = ({ initialOrigin, initialDestination, height = '600px', title = "Map" }) => {
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

  const [place1, setPlace1] = useState(initialOrigin || '');
  const [place2, setPlace2] = useState(initialDestination || '');
  const [provider, setProvider] = useState('google'); // 'google' | 'ptv'
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routePath, setRoutePath] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setPlace1(initialOrigin || '');
    setPlace2(initialDestination || '');
  }, [initialOrigin, initialDestination]);

  const calculateRoute = async () => {
    if (!place1 || !place2) return;
    setError(null);
    setRouteInfo(null);
    setIsLoading(true);

    try {
      // 1. Geocode locations
      const coords1 = await MapService.geocode(place1);
      const coords2 = await MapService.geocode(place2);

      const origin = { lat: parseFloat(coords1.lat), lng: parseFloat(coords1.lng) };
      const destination = { lat: parseFloat(coords2.lat), lng: parseFloat(coords2.lng) };

      // 2. Decide vehicle profile based on provider
      // If PTV is selected, pass type: 'truck' so MapService/Backend uses PTV
      // If Google is selected, pass null for default car routing
      const vehicleProfile = provider === 'ptv' ? { type: 'truck' } : null;

      const routeResult = await MapService.getRoute(origin, destination, [], vehicleProfile);
      
      let extractedToll = 0;
      let hasTolls = false;
      
      // Attempt to extract toll from various common PTV / Trimble formats
      if (routeResult.tolls?.amount !== undefined) { extractedToll = routeResult.tolls.amount; hasTolls = true; }
      else if (routeResult.tolls?.costs?.prices) {
        const usdPrice = routeResult.tolls.costs.prices.find(p => p.currency === 'USD');
        extractedToll = usdPrice ? usdPrice.price : (routeResult.tolls.costs.prices[0]?.price || 0);
        hasTolls = true;
      }
      else if (routeResult.toll?.amount !== undefined) { extractedToll = routeResult.toll.amount; hasTolls = true; }
      else if (routeResult.tollPrice !== undefined) { extractedToll = routeResult.tollPrice; hasTolls = true; }
      else if (routeResult.tolls?.cost !== undefined) { extractedToll = routeResult.tolls.cost; hasTolls = true; }
      else if (typeof routeResult.tolls === 'number') { extractedToll = routeResult.tolls; hasTolls = true; }
      else if (routeResult.toll?.costs?.length > 0) { extractedToll = routeResult.toll.costs[0].amount || 0; hasTolls = true; }

      // Log routeResult to console so user can inspect if tolls are missing
      console.log("Map Routing Response:", routeResult);

      setRouteInfo({
        distance: routeResult.distance,
        distanceUnit: routeResult.distanceUnit,
        durationText: routeResult.durationText,
        durationHours: (routeResult.duration / 3600).toFixed(2),
        cost: extractedToll,
        tollAvailable: hasTolls || routeResult.tolls?.tollAvailable !== false
      });

      // 3. Render Route path
      const fullRoadPath = MapService.parseRoutePath(routeResult?.path);
      if (fullRoadPath.length < 2) {
        throw new Error("Road route geometry is unavailable or invalid.");
      }

      setRoutePath(fullRoadPath);
      setMarkers([origin, destination]);

    } catch (err) {
      console.error(err);
      setRoutePath([]);
      setError(err.message || "Failed to calculate route or fetch coordinates");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fms-map-container" style={{ height }}>
      <div className="fms-map-header">
        <h4 style={{ margin: 0 }}>{title}</h4>
        <div className="fms-map-provider-switch">
          <label style={{ margin: 0, fontWeight: 500 }}>Provider:</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="google">Google Maps (Car Routing)</option>
            <option value="ptv">PTV Maps (Truck Routing)</option>
          </select>
        </div>
      </div>
      
      <div className="fms-map-body">
        {/* Sidebar */}
        <div className="fms-map-sidebar">
          <div>
            <label className="route-info-label">Origin</label>
            <input 
              type="text" 
              className="fms-address-input" 
              placeholder="Enter Origin"
              value={place1} 
              onChange={(e) => setPlace1(e.target.value)} 
            />
          </div>
          <div>
            <label className="route-info-label">Destination</label>
            <input 
              type="text" 
              className="fms-address-input" 
              placeholder="Enter Destination"
              value={place2} 
              onChange={(e) => setPlace2(e.target.value)} 
            />
          </div>
          <button 
            onClick={calculateRoute} 
            className="fms-calc-btn"
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Calculate Route"}
          </button>

          {error && <div className="fms-error-msg">{error}</div>}

          {routeInfo && (
            <div className="route-info-card">
              <div className="route-info-row">
                <span className="route-info-label">Distance:</span>
                <span className="route-info-value">{routeInfo.distance} {routeInfo.distanceUnit}</span>
              </div>
              <div className="route-info-row">
                <span className="route-info-label">ETA:</span>
                <span className="route-info-value">{routeInfo.durationHours} Hrs ({routeInfo.durationText})</span>
              </div>
              <div className="route-info-row">
                <span className="route-info-label">Tolls:</span>
                <span className="route-info-value">
                  {routeInfo.tollAvailable ? `$${routeInfo.cost}` : 'N/A'}
                </span>
              </div>
              {routeInfo.distance > 0 && routeInfo.tollAvailable && routeInfo.cost > 0 && (
                <div className="route-info-row">
                  <span className="route-info-label">Cost/Mile:</span>
                  <span className="route-info-value">${(routeInfo.cost / routeInfo.distance).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="fms-map-content">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markers.length > 0 ? markers[0] : defaultCenter}
              zoom={markers.length > 0 ? 6 : 4}
              options={{
                streetViewControl: false,
                mapTypeControl: false
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
                    text: index === 0 ? "A" : "B",
                    color: "white"
                  }} 
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="d-flex align-items-center justify-content-center bg-light w-100 h-100">
              <span>Loading Maps...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FmsMap;
