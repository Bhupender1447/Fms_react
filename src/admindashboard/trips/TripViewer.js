import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoogleMap, PolylineF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import MapService from "../../services/MapService";
import { BASE_URL } from "../../config";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../../mapConfig";
import "bootstrap/dist/css/bootstrap.min.css"; 

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 43.710513,
  lng: -79.828695
};

const toLocalDateTimeInput = (value) => {
  if (!value) return '';
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return '';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const sampleRoute = (path, maxPoints = 10) => {
  if (path.length <= maxPoints) return path;
  const count = Math.max(2, maxPoints);
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const distance = (left, right) => {
    const latDelta = toRadians(right.lat - left.lat);
    const lngDelta = toRadians(right.lng - left.lng);
    const a = Math.sin(latDelta / 2) ** 2
      + Math.cos(toRadians(left.lat)) * Math.cos(toRadians(right.lat)) * Math.sin(lngDelta / 2) ** 2;
    return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  const cumulative = [0];
  for (let index = 1; index < path.length; index += 1) cumulative.push(cumulative[index - 1] + distance(path[index - 1], path[index]));
  const totalDistance = cumulative[cumulative.length - 1];
  if (!totalDistance) return Array.from({ length: count }, (_, index) => path[Math.round(index * (path.length - 1) / (count - 1))]);
  return Array.from({ length: count }, (_, sampleIndex) => {
    const targetDistance = totalDistance * sampleIndex / (count - 1);
    let closestIndex = 0;
    for (let index = 1; index < cumulative.length; index += 1) {
      if (Math.abs(cumulative[index] - targetDistance) < Math.abs(cumulative[closestIndex] - targetDistance)) closestIndex = index;
    }
    return path[closestIndex];
  });
};

const TripViewer = () => {
  const { tripId } = useParams();
  const [error, setError] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState('ptv');
  const [routeChoice, setRouteChoice] = useState('fast');
  const [truckId, setTruckId] = useState(null);
  const [conditions, setConditions] = useState(null);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [conditionsLoading, setConditionsLoading] = useState(false);
  const [conditionsError, setConditionsError] = useState('');
  const [plannedDepartureAt, setPlannedDepartureAt] = useState(() => toLocalDateTimeInput(new Date()));
  const [weatherAssessment, setWeatherAssessment] = useState(null);
  const [weatherAssessmentLoading, setWeatherAssessmentLoading] = useState(false);
  const [weatherAssessmentError, setWeatherAssessmentError] = useState('');
  const [routeDurationSeconds, setRouteDurationSeconds] = useState(0);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'isovia-google-maps-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || 'missing-google-maps-api-key',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const mapRef = useRef(null);
  const polylineRef = useRef(null);

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

  const fetchTripAndCalculateRoute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setConditions(null);
      setConditionsOpen(false);
      setConditionsError('');
      setWeatherAssessment(null);
      setWeatherAssessmentError('');
      setRouteDurationSeconds(0);
      const response = await axios.get(`${BASE_URL}api/trip/${tripId}`);
      if (response.data && response.data.status === 'error') {
        throw new Error(response.data.message || "Trip not found.");
      }
      const tripData = response.data.data || response.data;
      if (!tripData || tripData.status === 'error') {
        throw new Error(tripData?.message || "Trip not found.");
      }
      const departureCandidates = [tripData.pickup_datetime, tripData.departure_time, tripData.pickup_date, tripData.pickupdate];
      const departureInput = departureCandidates.map(toLocalDateTimeInput).find(Boolean) || toLocalDateTimeInput(new Date());
      setPlannedDepartureAt(departureInput);
      const assignedTruck = tripData.truck_id || tripData.truckId || tripData.truckid || tripData.truck?.id || null;
      setTruckId(assignedTruck);
      
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

      const vehicleProfile = provider === 'ptv' ? { type: 'truck', id: assignedTruck } : { type: 'car' };
      const routeResult = await MapService.getRoute(
          origin, 
          destination, 
          waypoints, 
          vehicleProfile,
          routeChoice
      );

      const fullRoadPath = MapService.parseRoutePath(routeResult?.path);
      if (fullRoadPath.length < 2) {
        throw new Error("Road route geometry is unavailable or invalid.");
      }

      setRoutePath(fullRoadPath);
      setIsLoading(false);
      const durationSeconds = Number(routeResult?.duration ?? routeResult?.durationSeconds ?? 0);
      setRouteDurationSeconds(Number.isFinite(durationSeconds) ? durationSeconds : 0);
      setWeatherAssessmentLoading(true);
      try {
        const weather = await MapService.assessRouteWeather(
          sampleRoute(fullRoadPath),
          new Date(departureInput).toISOString(),
          Number.isFinite(durationSeconds) ? durationSeconds : 0
        );
        setWeatherAssessment(weather);
      } catch (weatherErr) {
        setWeatherAssessmentError(weatherErr.message || 'Weather forecast could not be checked.');
      } finally {
        setWeatherAssessmentLoading(false);
      }
    } catch (err) {
      console.error("Error loading trip map:", err);
      setRoutePath([]);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [tripId, provider, routeChoice]);

  const reassessWeather = useCallback(async () => {
    if (routePath.length < 2 || !plannedDepartureAt) return;
    setWeatherAssessmentLoading(true);
    setWeatherAssessmentError('');
    try {
      const assessment = await MapService.assessRouteWeather(
        sampleRoute(routePath),
        new Date(plannedDepartureAt).toISOString(),
        routeDurationSeconds
      );
      setWeatherAssessment(assessment);
    } catch (weatherErr) {
      setWeatherAssessmentError(weatherErr.message || 'Weather forecast could not be checked.');
    } finally {
      setWeatherAssessmentLoading(false);
    }
  }, [plannedDepartureAt, routeDurationSeconds, routePath]);

  const loadRouteConditions = useCallback(async () => {
    if (conditions) {
      setConditionsOpen((open) => !open);
      return;
    }
    if (markers.length < 2) return;
    setConditionsOpen(true);
    setConditionsLoading(true);
    setConditionsError('');
    try {
      const sampleStep = Math.max(1, Math.ceil(routePath.length / 50));
      const path = routePath.filter((_, index) => index % sampleStep === 0);
      setConditions(await MapService.getRouteConditions(markers[0], markers[markers.length - 1], path));
    } catch (err) {
      setConditionsError(err.message || 'Could not load route conditions.');
    } finally {
      setConditionsLoading(false);
    }
  }, [conditions, markers, routePath]);

  const conditionSummary = (stopConditions) => {
    const weather = stopConditions?.weather?.current;
    const weatherText = weather?.weatherCondition?.description?.text || weather?.weatherCondition?.type || 'Unavailable';
    const temperature = weather?.temperature?.degrees;
    const tempText = Number.isFinite(Number(temperature)) ? `${Math.round(Number(temperature))}°` : '';
    const forecastHours = stopConditions?.weather?.forecast;
    const forecastHigh = Array.isArray(forecastHours)
      ? forecastHours.reduce((high, hour) => Math.max(high, Number(hour?.temperature?.degrees ?? -Infinity)), -Infinity)
      : -Infinity;
    const airIndex = stopConditions?.airQuality?.current?.indexes?.[0];
    const pollenInfo = stopConditions?.pollen?.dailyInfo?.[0]?.pollenTypeInfo || [];
    const pollenSummary = pollenInfo.length
      ? pollenInfo.map((item) => `${item.displayName || item.code}: ${item.indexInfo?.category || 'no data'}`).join(' · ')
      : 'Unavailable';
    return { weather: [weatherText, tempText].filter(Boolean).join(' '), forecastHigh, airIndex, pollenSummary };
  };

  const assessmentMatchesDeparture = weatherAssessment?.departureAt && plannedDepartureAt
    ? Math.abs(new Date(weatherAssessment.departureAt).getTime() - new Date(plannedDepartureAt).getTime()) < 1000
    : false;

  useEffect(() => {
    if (tripId) {
      fetchTripAndCalculateRoute();
    }
  }, [tripId, provider, fetchTripAndCalculateRoute]);

  if (error) {
    return <div className="alert alert-danger m-3">Error loading map: {error.message || "Unknown error"}</div>;
  }

  return (
    <div className="content-wrapper p-0 m-0 position-relative">
      
      {/* Absolute positioned Provider Switch over Map */}
      <div className="position-absolute top-0 start-0 m-3 p-3 bg-white shadow rounded z-3" style={{ zIndex: 1000, maxWidth: 420, maxHeight: '90vh', overflowY: 'auto' }}>
        <h5 className="mb-2">Trip #{tripId} Viewer</h5>
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold m-0 text-nowrap">Map Provider:</label>
          <select className="form-select form-select-sm" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="ptv">PTV Maps (Truck)</option>
            <option value="google">Google Maps (Car, not truck constrained)</option>
          </select>
        </div>
        {provider === 'ptv' && !truckId && <div className="alert alert-warning py-2 px-2 mt-2 mb-2 small">No assigned truck dimensions were found. This route uses a generic truck profile; verify height, weight, and trailer restrictions.</div>}
        {provider === 'google' && <div className="alert alert-warning py-2 px-2 mt-2 mb-2 small">Car routing does not apply the assigned truck and trailer dimensions. Use the truck profile before dispatch.</div>}
        <label className="form-label small fw-bold mt-2 mb-1" htmlFor="trip-route-choice">Route preference</label>
        <select id="trip-route-choice" className="form-select form-select-sm" value={routeChoice} onChange={(event) => setRouteChoice(event.target.value)}>
          <option value="fast">Fastest</option>
          <option value="shortest">Shortest</option>
          {provider === 'ptv' && <option value="economic">Economic</option>}
        </select>
        <label className="form-label small fw-bold mt-2 mb-1" htmlFor="planned-weather-departure">Planned departure</label>
        <input id="planned-weather-departure" className="form-control form-control-sm" type="datetime-local" value={plannedDepartureAt} onChange={(event) => setPlannedDepartureAt(event.target.value)} />
        <div className="small text-muted mt-1">Confirm the actual local departure time. Weather is matched to estimated passage times at up to 10 points along the route.</div>
        <div className={`alert py-2 px-2 mt-2 mb-2 small ${weatherAssessmentError ? 'alert-danger' : !assessmentMatchesDeparture && weatherAssessment ? 'alert-info' : weatherAssessment?.requiresDispatchReview ? 'alert-warning' : weatherAssessment?.status === 'NO_HAZARDS_FOUND' ? 'alert-success' : 'alert-secondary'}`} role="status" aria-live="polite">
          {weatherAssessmentLoading ? 'Checking route weather and official alerts…' : (weatherAssessmentError || (!assessmentMatchesDeparture && weatherAssessment)) ? (weatherAssessmentError || 'Departure changed. Reassess weather before dispatch.') : weatherAssessment?.status === 'NO_HAZARDS_FOUND' ? 'No selected weather hazards found in the available forecast.' : weatherAssessment?.requiresDispatchReview ? 'Weather review required before dispatch.' : 'Weather review has not completed.'}
        </div>
        {weatherAssessment?.hazards?.length > 0 && (
          <ul className="small ps-3 mb-2">
            {weatherAssessment.hazards.map((hazard, index) => (
              <li key={`${hazard.type}-${hazard.point}-${index}`} className={hazard.level === 'HIGH' ? 'text-danger fw-bold' : 'text-dark'}>
                {hazard.message}{hazard.authorityUri ? <> · <a href={hazard.authorityUri} target="_blank" rel="noreferrer">{hazard.authority || 'Alert authority'}</a></> : null}
              </li>
            ))}
          </ul>
        )}
        {weatherAssessment?.segments?.filter((segment) => segment.forecastAvailable).length > 0 && (
          <div className="small mb-2">
            {weatherAssessment.segments.filter((segment) => segment.forecastAvailable).map((segment) => (
              <div key={`weather-point-${segment.point}`}>
                Point {segment.point} ({new Date(segment.estimatedPassageAt).toLocaleString()}): {segment.windMph === null ? 'wind unavailable' : `${segment.windMph} mph wind, ${segment.gustMph} mph gust`}; {segment.condition || segment.precipitationType || 'forecast available'}{segment.visibilityMiles !== null ? `; visibility ${segment.visibilityMiles} mi` : ''}
              </div>
            ))}
          </div>
        )}
        {weatherAssessment && !weatherAssessment.forecastCoverageComplete && <div className="small text-warning mb-2">Some route points have no matching forecast. Recheck closer to departure.</div>}
        <div className="small text-muted mb-2">{weatherAssessment?.roadClosureMessage || 'Road closures are not verified by the weather forecast. Check state/provincial 511 before dispatch.'}</div>
        <button type="button" className="btn btn-outline-warning btn-sm w-100" onClick={reassessWeather} disabled={isLoading || weatherAssessmentLoading || routePath.length < 2 || !plannedDepartureAt}>
          {weatherAssessmentLoading ? 'Assessing weather…' : 'Reassess for this departure'}
        </button>
        <button type="button" className="btn btn-outline-primary btn-sm mt-2 w-100" onClick={loadRouteConditions} disabled={isLoading || markers.length < 2 || conditionsLoading}>
          {conditionsLoading ? 'Loading route conditions…' : conditionsOpen ? 'Hide route conditions' : 'Show route conditions'}
        </button>
        {conditionsOpen && (
          <div className="mt-2 border-top pt-2 small" aria-live="polite">
            {conditionsLoading ? <div className="text-muted">Loading weather and environmental forecasts for both ends of the trip…</div> : null}
            {conditionsError ? <div className="text-danger">{conditionsError}</div> : null}
            {conditions && !conditionsLoading && ['origin', 'destination'].map((key) => {
              const summary = conditionSummary(conditions[key]);
              return (
                <div className="mb-2" key={key}>
                  <strong>{key === 'origin' ? 'Origin' : 'Destination'}</strong>
                  <div>Weather: {summary.weather}{Number.isFinite(summary.forecastHigh) ? ` · 24h high ${Math.round(summary.forecastHigh)}°` : ''}</div>
                  <div>Air quality: {summary.airIndex ? `${summary.airIndex.aqiDisplay || summary.airIndex.aqi || ''} ${summary.airIndex.category || ''}`.trim() : 'Unavailable'}</div>
                  <div>Pollen: {summary.pollenSummary}</div>
                </div>
              );
            })}
            {conditions?.elevation && <div>Route elevation: {conditions.elevation.minimumMeters}–{conditions.elevation.maximumMeters} m sampled</div>}
          </div>
        )}
      </div>

      {!GOOGLE_MAPS_API_KEY ? (
        <div className="d-flex justify-content-center align-items-center vh-100 text-center p-4">
          Google Maps is not configured. Add REACT_APP_GOOGLE_MAPS_API_KEY to the React environment and restart the app.
        </div>
      ) : loadError ? (
        <div className="d-flex justify-content-center align-items-center vh-100 text-center p-4">
          Google Maps could not load. Check the browser key, its referrer restrictions, and Maps JavaScript API access.
        </div>
      ) : isLoading || !isLoaded ? (
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
