import React, { useState, useEffect, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GoogleMap, PolylineF, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import MapService from "../services/MapService";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from "../mapConfig";

const expenseOptions = [
  "Layover", "Detention", "Driver Assist", "Driver Load/Unload", "Driver Count",
  "TONU (Truck Ordered Not Used)", "Redelivery", "Reconsignment / Diversion",
  "Stop-Off Charges (Multiple Stops)", "Deadhead / Empty Miles", "Tarping Fee (Flatbed)",
  "Lumper Fee", "Liftgate Service", "Pallet Jack Service", "Inside Delivery",
  "Residential Delivery", "Limited Access Delivery", "Border Crossing Fee",
  "Customs Clearance Fee", "Hazardous Materials (HAZMAT) Handling",
  "Refrigeration (Reefer Fuel Surcharge)", "Clean Truck / Washout Fee",
  "Storage / Warehouse Fee", "Border Wait Time", "Inbound Handling Fee",
  "Appointment Scheduling Fee", "Escort / Pilot Car Fee (Oversize Loads)",
  "Permits (Oversize / Overweight)", "Scale Ticket Fee", "Toll Reimbursement",
  "Ferry Fee", "Fuel Surcharge", "Excess Mileage Fee", "Parking Fee",
  "After-Hours / Weekend Delivery", "Holiday Delivery Surcharge",
];

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const center = {
  lat: 43.710513,
  lng: -79.828695
};

const Distancepopup = ({ places1, places2, places3 = [] }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'isovia-google-maps-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || 'missing-google-maps-api-key',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [place1, setPlace1] = useState(places1 || "");
  const [place2, setPlace2] = useState(places2 || "");
  const [place3, setPlace3] = useState(Array.isArray(places3) ? places3 : []);
  const [provider, setProvider] = useState('google');
  const [routeChoice, setRouteChoice] = useState('fast');
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeAlternatives, setRouteAlternatives] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [timeZones, setTimeZones] = useState(null);
  const [timeZoneLoading, setTimeZoneLoading] = useState(false);
  const [routeConditions, setRouteConditions] = useState(null);
  const [conditionsLoading, setConditionsLoading] = useState(false);
  const [optimizingStops, setOptimizingStops] = useState(false);
  const [optimizationMessage, setOptimizationMessage] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbySearch, setNearbySearch] = useState('');
  const [includeTolls, setIncludeTolls] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routePath, setRoutePath] = useState([]);
  const [markers, setMarkers] = useState([]);

  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const lastAutoRouteKey = useRef('');

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
      map.fitBounds(bounds, 50);
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
    const nearbyMarkers = nearbyPlaces.filter((place) => Number.isFinite(Number(place.location?.latitude)) && Number.isFinite(Number(place.location?.longitude)))
      .map((place) => ({ lat: Number(place.location.latitude), lng: Number(place.location.longitude) }));
    if (routePath && routePath.length > 0) {
      drawPolylineOnMap(map, routePath, provider);
      fitBounds(map, routePath, [...markers, ...nearbyMarkers]);
    } else if (markers && markers.length > 0) {
      fitBounds(map, [], [...markers, ...nearbyMarkers]);
    }
  }, [routePath, markers, nearbyPlaces, provider, drawPolylineOnMap, fitBounds]);

  useEffect(() => {
    if (mapRef.current) {
      drawPolylineOnMap(mapRef.current, routePath, provider);
      const nearbyMarkers = nearbyPlaces.filter((place) => Number.isFinite(Number(place.location?.latitude)) && Number.isFinite(Number(place.location?.longitude)))
        .map((place) => ({ lat: Number(place.location.latitude), lng: Number(place.location.longitude) }));
      if (routePath.length > 0 || markers.length > 0 || nearbyMarkers.length > 0) {
        fitBounds(mapRef.current, routePath, [...markers, ...nearbyMarkers]);
      }
    }
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [routePath, markers, nearbyPlaces, provider, drawPolylineOnMap, fitBounds]);

  // Expenses state
  const [expenses, setExpenses] = useState([{ type: "", amount: "" }]);

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { type: "", amount: "" }]);
  };

  const removeExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const safeGeocode = useCallback(async (address) => {
    if (!address || !String(address).trim()) return null;
    try {
      return await MapService.geocode(address);
    } catch (err) {
      if (window.google?.maps?.Geocoder) {
        return new Promise((resolve, reject) => {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: String(address).trim() }, (results, status) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              const loc = results[0].geometry.location;
              resolve({
                lat: loc.lat(),
                lng: loc.lng(),
                address: results[0].formatted_address || address
              });
            } else {
              reject(new Error(`Could not find coordinates for: ${address}`));
            }
          });
        });
      }
      throw err;
    }
  }, []);

  const getGoogleDirectionsFallback = useCallback((origin, destination, waypoints, activeChoice = 'fast', isTruck = false) => {
    return new Promise((resolve, reject) => {
      if (!window.google?.maps?.DirectionsService) {
        return reject(new Error('Google Maps routing service is currently unavailable'));
      }
      const ds = new window.google.maps.DirectionsService();
      const choice = (activeChoice || 'fast').toLowerCase();
      const shouldAvoidTolls = choice === 'economic';

      ds.route({
        origin,
        destination,
        waypoints: (waypoints || []).map(w => ({ location: w, stopover: true })),
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        avoidTolls: shouldAvoidTolls,
      }, (result, status) => {
        if (status === 'OK' && result?.routes?.[0]) {
          const routes = result.routes;
          let selectedRoute = routes[0];

          if (routes.length > 1) {
            if (choice === 'shortest') {
              selectedRoute = routes.reduce((minR, curR) => {
                const minD = minR.legs.reduce((s, l) => s + (l.distance?.value || 0), 0);
                const curD = curR.legs.reduce((s, l) => s + (l.distance?.value || 0), 0);
                return curD < minD ? curR : minR;
              }, routes[0]);
            } else if (choice === 'fast') {
              selectedRoute = routes.reduce((minR, curR) => {
                const minT = minR.legs.reduce((s, l) => s + (l.duration?.value || 0), 0);
                const curT = curR.legs.reduce((s, l) => s + (l.duration?.value || 0), 0);
                return curT < minT ? curR : minR;
              }, routes[0]);
            } else if (choice === 'economic') {
              selectedRoute = routes.reduce((minR, curR) => {
                const minD = minR.legs.reduce((s, l) => s + (l.distance?.value || 0), 0);
                const curD = curR.legs.reduce((s, l) => s + (l.distance?.value || 0), 0);
                return curD < minD ? curR : minR;
              }, routes[0]);
            }
          }

          let totalDistanceMeters = 0;
          let totalDurationSeconds = 0;
          const path = [];
          selectedRoute.legs.forEach(leg => {
            totalDistanceMeters += leg.distance?.value || 0;
            totalDurationSeconds += leg.duration?.value || 0;
            leg.steps.forEach(step => {
              step.path.forEach(pt => {
                path.push({ lat: pt.lat(), lng: pt.lng() });
              });
            });
          });

          const finalDurationSeconds = isTruck ? Math.round(totalDurationSeconds * 1.18) : totalDurationSeconds;
          const distanceMiles = (totalDistanceMeters / 1609.344).toFixed(1);
          const distanceKms = (totalDistanceMeters / 1000).toFixed(1);
          const hrs = Math.floor(finalDurationSeconds / 3600);
          const mins = Math.round((finalDurationSeconds % 3600) / 60);
          const durationText = hrs > 0 ? `${hrs} hrs ${mins} mins` : `${mins} mins`;

          let estimatedToll = 0;
          let tollAvailable = false;
          if (choice !== 'economic' && isTruck) {
            tollAvailable = true;
            estimatedToll = parseFloat((parseFloat(distanceMiles) * 0.14 * 0.35).toFixed(2));
          }

          const legs = selectedRoute.legs.map((leg, idx) => ({
            name: `Leg ${idx + 1}`,
            distanceMiles: (leg.distance?.value / 1609.344).toFixed(1),
            distanceKms: (leg.distance?.value / 1000).toFixed(1),
            durationText: leg.duration?.text || ''
          }));

          resolve({
            distance: distanceMiles,
            distanceMiles,
            distanceKms,
            distanceUnit: 'mi',
            duration: finalDurationSeconds,
            durationText,
            path,
            tolls: { tollAvailable, amount: estimatedToll, currency: 'USD' },
            legs,
            stateMileage: legs
          });
        } else {
          reject(new Error(`Google Maps route calculation failed: ${status}`));
        }
      });
    });
  }, []);

  const calculateDistance = useCallback(async (
    stopsToRoute = place3,
    activeProvider = provider,
    activeChoice = routeChoice,
    activeTolls = includeTolls
  ) => {
    if (!place1 || !place2) return;
    const actualStops = Array.isArray(stopsToRoute) ? stopsToRoute : (Array.isArray(place3) ? place3 : []);
    setError(null);
    setRouteInfo(null);
    setRouteAlternatives([]);
    setIsLoading(true);

    try {
      // 1. Geocode all locations using safeGeocode (MapService with Google Geocoder fallback)
      const coords1 = await safeGeocode(place1);
      const coords2 = await safeGeocode(place2);
      
      const coords3 = [];
      for (let stop of actualStops) {
        if (stop && stop.location) {
           const c = await safeGeocode(stop.location);
           if (c) coords3.push(c);
        }
      }

      // 2. Fetch Route Data
      const waypoints = coords3.map(c => ({ lat: parseFloat(c.lat), lng: parseFloat(c.lng) }));
      const origin = { lat: parseFloat(coords1.lat), lng: parseFloat(coords1.lng) };
      const destination = { lat: parseFloat(coords2.lat), lng: parseFloat(coords2.lng) };

      let routeResult;
      const isTruck = activeProvider === 'ptv';
      const vehicleProfile = isTruck ? { type: 'truck' } : { type: 'car' };

      try {
        routeResult = await MapService.getRoute(origin, destination, waypoints, vehicleProfile, activeChoice, activeTolls);
      } catch (routingErr) {
        console.warn("MapService route error, using local fallback:", routingErr);
        routeResult = await getGoogleDirectionsFallback(origin, destination, waypoints, activeChoice, isTruck);
      }

      const routeOptions = [routeResult, ...(routeResult.alternatives || [])].map((route, index) => ({
        index,
        path: MapService.parseRoutePath(route.path),
        distance: route.distance,
        distanceMiles: route.distanceMiles,
        distanceKms: route.distanceKms,
        distanceUnit: route.distanceUnit,
        duration: route.duration,
        durationText: route.durationText,
        durationHours: (Number(route.duration || 0) / 3600).toFixed(2),
        tolls: route.tolls,
        cost: Number(route.tolls?.amount || 0),
        tollCurrency: route.tolls?.currency || '',
        tollAvailable: route.tolls?.amount !== undefined && route.tolls?.amount !== null,
        legs: route.legs || route.stateMileage || [],
      }));
      setRouteAlternatives(routeOptions);
      setSelectedRouteIndex(0);
      
      let extractedToll = 0;
      let hasTolls = false;
      
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

      setRouteInfo({
        distance: routeResult.distance,
        distanceMiles: routeResult.distanceMiles,
        distanceKms: routeResult.distanceKms,
        stateMileage: routeResult.stateMileage || routeResult.legs || [],
        distanceUnit: routeResult.distanceUnit,
        durationText: routeResult.durationText,
        durationHours: (routeResult.duration / 3600).toFixed(2),
        cost: extractedToll,
        tollCurrency: routeResult.tolls?.currency || '',
        tollAvailable: hasTolls || routeResult.tolls?.tollAvailable === true,
        legs: routeResult.legs || routeResult.stateMileage || [],
        activeProvider,
        activeChoice,
        isTruckProfile: isTruck
      });

      // 3. Render Route path
      const fullRoadPath = MapService.parseRoutePath(routeResult?.path);
      if (fullRoadPath.length < 2) {
        throw new Error("Road route geometry is unavailable or invalid.");
      }
      
      setRoutePath(fullRoadPath);
      setMarkers([origin, ...waypoints, destination]);
      setTimeZones(null);
      setNearbyPlaces([]);
      setRouteConditions(null);

    } catch (err) {
      console.error(err);
      setRoutePath([]);
      setError(err.message || "Failed to calculate route or fetch coordinates");
    } finally {
      setIsLoading(false);
    }
  }, [place1, place2, place3, provider, routeChoice, includeTolls, safeGeocode, getGoogleDirectionsFallback]);

  const selectRoute = (route) => {
    setSelectedRouteIndex(route.index);
    setRoutePath(route.path);
    setRouteConditions(null);
    setTimeZones(null);
    setRouteInfo({
      distance: route.distance,
      distanceMiles: route.distanceMiles,
      distanceKms: route.distanceKms,
      distanceUnit: route.distanceUnit,
      duration: route.duration,
      durationText: route.durationText,
      durationHours: route.durationHours,
      cost: route.cost,
      tollCurrency: route.tollCurrency,
      tollAvailable: route.tollAvailable,
      stateMileage: route.legs,
    });
  };

  const optimizeStopOrder = async () => {
    const validStops = place3.filter((stop) => String(stop.location || '').trim());
    if (validStops.length < 2) return;
    if (validStops.length > 20) {
      setError('Stop optimization supports up to 20 intermediate stops at a time.');
      return;
    }
    setOptimizingStops(true);
    setError(null);
    try {
      let stopOrder = null;
      let optimizer = 'Google Route Optimization';

      // 1. First try client-side Google Maps DirectionsService waypoint optimization
      if (window.google?.maps?.DirectionsService) {
        try {
          stopOrder = await new Promise((resolve, reject) => {
            const ds = new window.google.maps.DirectionsService();
            ds.route({
              origin: place1,
              destination: place2,
              waypoints: validStops.map((s) => ({ location: s.location, stopover: true })),
              optimizeWaypoints: true,
              travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
              if (status === 'OK' && result?.routes?.[0]?.waypoint_order && result.routes[0].waypoint_order.length === validStops.length) {
                resolve(result.routes[0].waypoint_order);
              } else {
                reject(new Error(`Google waypoint optimization status: ${status}`));
              }
            });
          });
          optimizer = 'Google Maps Directions Optimizer';
        } catch (clientOptError) {
          console.warn('Browser waypoint optimization unavailable, falling back:', clientOptError);
        }
      }

      // 2. If client-side didn't produce the order, try backend
      if (!stopOrder || stopOrder.length !== validStops.length) {
        const addresses = [place1, ...validStops.map((stop) => stop.location), place2];
        const points = await Promise.all(addresses.map((address) => safeGeocode(address)));
        try {
          stopOrder = await MapService.optimizeStops(points[0], points[points.length - 1], points.slice(1, -1));
          if (stopOrder.length !== validStops.length) throw new Error('Google returned an incomplete sequence');
          optimizer = 'Google Route Optimization API';
        } catch (optimizationUnavailable) {
          if (points.length > 10) throw new Error(optimizationUnavailable.message || 'Matrix fallback supports up to 8 stops.');
          optimizer = 'traffic matrix fallback';
          const matrix = await MapService.getRouteMatrix(points, points);
          const durations = new Map();
          (Array.isArray(matrix) ? matrix : []).forEach((element) => {
            if ((element.status?.code === undefined || element.status.code === 0) && element.condition !== 'ROUTE_NOT_FOUND') {
              const seconds = Number.parseInt(String(element.duration || '').replace('s', ''), 10);
              if (Number.isFinite(seconds)) durations.set(`${element.originIndex}-${element.destinationIndex}`, seconds);
            }
          });
          stopOrder = [];
          const remaining = new Set(validStops.map((_, index) => index + 1));
          let current = 0;
          while (remaining.size) {
            let next = null;
            let shortestDuration = Number.MAX_SAFE_INTEGER;
            for (const index of remaining) {
              const duration = durations.get(`${current}-${index}`) ?? Number.MAX_SAFE_INTEGER;
              if (duration < shortestDuration) {
                shortestDuration = duration;
                next = index;
              }
            }
            if (durations.get(`${current}-${next}`) === undefined) throw new Error('Could not compare route times for these stops.');
            stopOrder.push(next - 1);
            remaining.delete(next);
            current = next;
          }
        }
      }

      const ordered = stopOrder.map((index) => validStops[index]).filter(Boolean);
      if (ordered.length !== validStops.length) throw new Error('Could not map optimized stops back to the entered locations.');
      const reorderedStops = place3.map((stop) => String(stop.location || '').trim() ? ordered.shift() : stop);
      setPlace3(reorderedStops);
      setOptimizationMessage(`Stop sequence optimized with ${optimizer}.`);
      await calculateDistance(reorderedStops);
    } catch (optimizationError) {
      setError(optimizationError.message || 'Could not optimize this stop order.');
    } finally {
      setOptimizingStops(false);
    }
  };

  const loadTimeZones = async () => {
    if (markers.length < 2) return;
    setTimeZoneLoading(true);
    try {
      const departureTimestamp = Math.floor(Date.now() / 1000);
      const arrivalTimestamp = routeInfo?.eta ? Math.floor(new Date(routeInfo.eta).getTime() / 1000) : departureTimestamp + Number(routeInfo?.duration || 0);
      const [originTimeZone, destinationTimeZone] = await Promise.all([
        MapService.getTimeZone(markers[0].lat, markers[0].lng, departureTimestamp),
        MapService.getTimeZone(markers[markers.length - 1].lat, markers[markers.length - 1].lng, arrivalTimestamp),
      ]);
      setTimeZones({ origin: originTimeZone, destination: destinationTimeZone });
    } catch (timeZoneError) {
      setError(timeZoneError.message || 'Could not load local time zone details.');
    } finally {
      setTimeZoneLoading(false);
    }
  };

  const loadNearbyTruckServices = async () => {
    if (!markers.length) return;
    setNearbyLoading(true);
    setError(null);
    try {
      const destination = markers[markers.length - 1];
      const places = nearbySearch.trim()
        ? await MapService.searchPlaces(nearbySearch.trim(), destination.lat, destination.lng)
        : await MapService.getNearbyPlaces(destination.lat, destination.lng, 15000);
      setNearbyPlaces(places.filter((place) => Number.isFinite(Number(place.location?.latitude)) && Number.isFinite(Number(place.location?.longitude))));
      if (!places.length) setError(nearbySearch.trim() ? `No results found for “${nearbySearch.trim()}” near the destination.` : 'No truck stops, fuel stations, or rest stops were found near the destination.');
    } catch (nearbyError) {
      setError(nearbyError.message || 'Could not find nearby truck services.');
    } finally {
      setNearbyLoading(false);
    }
  };

  const loadRouteConditions = async () => {
    if (markers.length < 2 || routePath.length < 2) return;
    setConditionsLoading(true);
    setError(null);
    try {
      const sampleCount = Math.min(100, routePath.length);
      const sampledPath = Array.from({ length: sampleCount }, (_, index) => routePath[Math.round(index * (routePath.length - 1) / Math.max(1, sampleCount - 1))]);
      const conditions = await MapService.getRouteConditions(markers[0], markers[markers.length - 1], sampledPath);
      setRouteConditions(conditions);
    } catch (conditionsError) {
      setError(conditionsError.message || 'Could not load weather and route conditions.');
    } finally {
      setConditionsLoading(false);
    }
  };

  const getWeatherSummary = (weather) => {
    if (!weather || weather.error) return weather?.error || 'Unavailable';
    const temperatureUnit = weather.temperature?.unit === 'FAHRENHEIT' ? '°F' : '°C';
    const windUnit = weather.wind?.speed?.unit === 'MILES_PER_HOUR' ? 'mph' : 'km/h';
    const parts = [weather.weatherCondition?.description?.text,
      weather.temperature?.degrees !== undefined ? `${Math.round(weather.temperature.degrees)}${temperatureUnit}` : null,
      weather.wind?.speed?.value !== undefined ? `Wind ${Math.round(weather.wind.speed.value)} ${windUnit}` : null].filter(Boolean);
    return parts.join(' · ') || 'Current conditions loaded';
  };

  const getAqiSummary = (airQuality) => {
    if (!airQuality || airQuality.error) return airQuality?.error || 'Unavailable';
    const index = airQuality.indexes?.find((item) => item.code === 'uaqi') || airQuality.indexes?.[0];
    return index ? `${index.displayName || 'AQI'} ${index.aqiDisplay || index.aqi}${index.category ? ` · ${index.category}` : ''}` : 'No index available';
  };

  useEffect(() => {
    const routeKey = `${places1 || ''}\u0000${places2 || ''}\u0000${provider}\u0000${routeChoice}\u0000${includeTolls}`;
    if (places1 && places2 && isLoaded && lastAutoRouteKey.current !== routeKey) {
      const timeoutId = setTimeout(() => {
        lastAutoRouteKey.current = routeKey;
        calculateDistance(place3, provider, routeChoice, includeTolls);
      }, 700);
      return () => clearTimeout(timeoutId);
    }
  }, [places1, places2, place3, provider, routeChoice, includeTolls, isLoaded, calculateDistance]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(place3);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPlace3(items);
    calculateDistance(items, provider, routeChoice, includeTolls);
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1>Distance & Expenses Calculator</h1>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <label className="fw-bold m-0">Map Provider:</label>
          <select 
            className="form-select form-select-sm w-auto" 
            value={provider} 
            onChange={(e) => {
              const newProvider = e.target.value;
              setProvider(newProvider);
              calculateDistance(place3, newProvider, routeChoice, includeTolls);
            }}
          >
            <option value="ptv">PTV Maps (Truck)</option>
            <option value="google">Google Maps (Car)</option>
          </select>

          <label className="fw-bold m-0 ms-2">Route:</label>
          <select 
            className="form-select form-select-sm w-auto" 
            value={routeChoice} 
            onChange={(e) => {
              const newChoice = e.target.value;
              setRouteChoice(newChoice);
              calculateDistance(place3, provider, newChoice, includeTolls);
            }}
          >
            <option value="fast">Fastest</option>
            <option value="shortest">Shortest</option>
            <option value="economic">Economic</option>
          </select>

          <label className="small d-flex align-items-center gap-1 ms-2 mb-0" title="Include estimated toll charges along the route">
            <input 
              type="checkbox" 
              checked={includeTolls} 
              onChange={(e) => {
                const newTolls = e.target.checked;
                setIncludeTolls(newTolls);
                calculateDistance(place3, provider, routeChoice, newTolls);
              }} 
            /> Include toll estimate
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div>
            <label className="w-100 fw-bold">
              Origin:
              <input
                type="text"
                className="form-control mt-1"
                value={place1}
                onChange={(e) => setPlace1(e.target.value)}
              />
            </label>
          </div>
          <div className="mt-3">
            <label className="w-100 fw-bold">
              Destination:
              <input
                type="text"
                className="form-control mt-1"
                value={place2}
                onChange={(e) => setPlace2(e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="w-100 fw-bold">
              Additional Stops (Drag to Reorder):
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stops">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="mt-2">
                      {place3.map((stop, index) => (
                        <Draggable key={`stop-${index}`} draggableId={`stop-${index}`} index={index}>
                          {(provided) => (
                            <div
                              className="mb-2 d-flex align-items-center bg-white border p-1 rounded"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <span className="me-2 text-muted px-2">☰</span>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={stop.location}
                                onChange={(e) => {
                                  const newStops = [...place3];
                                  newStops[index].location = e.target.value;
                                  setPlace3(newStops);
                                }}
                              />
                              <button 
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() => {
                                  const newStops = [...place3];
                                  newStops.splice(index, 1);
                                  setPlace3(newStops);
                                }}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <button
                className="btn btn-success btn-sm mt-2 w-100"
                onClick={() => setPlace3([...place3, { stoptype: "Intermediate", location: "" }])}
              >
                + Add Stop
              </button>
              {provider === 'google' && place3.filter((stop) => String(stop.location || '').trim()).length >= 2 && <>
                <button type="button" className="btn btn-outline-primary btn-sm mt-2 w-100" onClick={optimizeStopOrder} disabled={optimizingStops || isLoading}>
                  <i className={`fa ${optimizingStops ? 'fa-spinner fa-spin' : 'fa-magic'}`} /> {optimizingStops ? 'Comparing route times…' : 'Suggest faster stop order'}
                </button>
                <div className="small text-muted mt-1">Uses Google Route Optimization when configured, with a traffic matrix fallback. Origin and destination stay fixed.</div>
              </>}
            </label>
          </div>

          <button type="button" onClick={() => calculateDistance()} className="btn btn-primary w-100 mt-4 py-2 fw-bold" disabled={isLoading}>
            {isLoading ? "Calculating Route..." : "Calculate Route"}
          </button>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {optimizationMessage && <div className="alert alert-success mt-3 py-2">{optimizationMessage}</div>}

          {routeInfo && (
            <div className="mt-4 border p-3 rounded" style={{ background: '#f8f9fa' }}>
              <h4 className="mb-3 border-bottom pb-2">Route Summary</h4>
              {provider === 'ptv' ? (
                <div className="small text-success fw-bold mb-3 d-flex align-items-center gap-1">
                  <span className="badge bg-success">PTV TRUCK ROUTE</span> 
                  Commercial Truck Profile · {routeChoice === 'fast' ? 'Fastest' : routeChoice === 'shortest' ? 'Shortest' : 'Economic'}
                </div>
              ) : (
                <div className="small text-primary fw-bold mb-3 d-flex align-items-center gap-1">
                  <span className="badge bg-primary">GOOGLE CAR ROUTE</span> 
                  Standard Vehicle Profile · {routeChoice === 'fast' ? 'Fastest' : routeChoice === 'shortest' ? 'Shortest' : 'Economic'}
                </div>
              )}
              {routeAlternatives.length > 1 && <div className="mb-3">
                <div className="fw-bold small mb-2">Choose a route</div>
                <div className="d-grid gap-2">
                  {routeAlternatives.map((route) => <button key={route.index} type="button" className={`btn btn-sm text-start ${selectedRouteIndex === route.index ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => selectRoute(route)}>
                    <strong>{route.index === 0 ? 'Recommended' : `Alternative ${route.index}`}</strong>
                    <span className="ms-2">{route.distanceMiles} mi · {route.durationHours} hr</span>
                  </button>)}
                </div>
              </div>}
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-muted">Distance:</span> 
                <span className="fw-bold">
                  {routeInfo.distanceMiles ? `${routeInfo.distanceMiles} Miles | ` : ''}
                  {routeInfo.distanceKms ? `${routeInfo.distanceKms} Km` : `${routeInfo.distance} ${routeInfo.distanceUnit}`}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-muted">ETA:</span> 
                <span className="fw-bold">{routeInfo.durationHours} Hrs ({routeInfo.durationText})</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-muted">Estimated toll:</span> 
                <span className="fw-bold">{routeInfo.tollAvailable ? `${routeInfo.tollCurrency || '$'} ${routeInfo.cost} · ${provider === 'google' ? 'standard vehicle estimate' : 'provider estimate'}` : 'Unavailable'}</span>
              </div>
              {routeInfo.stateMileage && routeInfo.stateMileage.length > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold text-muted">State Legs:</span> 
                  <span className="fw-bold">{routeInfo.stateMileage.length} segments</span>
                </div>
              )}
              {routeInfo.distance > 0 && routeInfo.tollAvailable && routeInfo.cost > 0 && (
                <div className="d-flex justify-content-between">
                  <span className="fw-bold text-muted">Estimated toll / mile:</span> 
                  <span className="fw-bold">${(routeInfo.cost / (routeInfo.distanceMiles || (routeInfo.distance / 1609.34))).toFixed(2)}</span>
                </div>
              )}
              {provider === 'google' && markers.length > 1 && <div className="mt-3 pt-3 border-top">
                {!timeZones ? <button type="button" className="btn btn-outline-secondary btn-sm" onClick={loadTimeZones} disabled={timeZoneLoading}>
                  <i className={`fa ${timeZoneLoading ? 'fa-spinner fa-spin' : 'fa-globe'}`} /> {timeZoneLoading ? 'Loading local times…' : 'Show local departure and arrival times'}
                </button> : <div className="small">
                  <div><strong>Departure:</strong> {new Date().toLocaleString(undefined, { timeZone: timeZones.origin.timeZoneId })} <span className="text-muted">({timeZones.origin.timeZoneName})</span></div>
                  <div><strong>Arrival:</strong> {new Date(routeInfo.eta || Date.now() + Number(routeInfo.duration || 0) * 1000).toLocaleString(undefined, { timeZone: timeZones.destination.timeZoneId })} <span className="text-muted">({timeZones.destination.timeZoneName})</span></div>
                </div>}
              </div>}
              {provider === 'google' && markers.length > 1 && <div className="mt-3 pt-3 border-top">
                <label className="small fw-bold d-block mb-2">Search near destination
                  <input className="form-control form-control-sm mt-1" value={nearbySearch} onChange={(event) => setNearbySearch(event.target.value)} placeholder="Truck repair, scales, parking…" maxLength={120} />
                </label>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={loadNearbyTruckServices} disabled={nearbyLoading}>
                  <i className={`fa ${nearbyLoading ? 'fa-spinner fa-spin' : 'fa-map-marker'}`} /> {nearbyLoading ? 'Searching nearby places…' : nearbySearch.trim() ? 'Search this place type' : 'Find truck stops and fuel'}
                </button>
                {nearbyPlaces.length > 0 && <div className="mt-2 small">
                  {nearbyPlaces.map((place) => <div className="border rounded bg-white p-2 mb-1" key={place.id}>
                    <strong>{place.displayName?.text || 'Nearby service'}</strong><div className="text-muted">{place.formattedAddress || place.primaryType}</div>
                    {place.googleMapsUri && <a href={place.googleMapsUri} target="_blank" rel="noreferrer">Open in Google Maps</a>}
                  </div>)}
                </div>}
              </div>}
              {provider === 'google' && markers.length > 1 && <div className="mt-3 pt-3 border-top">
                {!routeConditions ? <button type="button" className="btn btn-outline-info btn-sm" onClick={loadRouteConditions} disabled={conditionsLoading}>
                  <i className={`fa ${conditionsLoading ? 'fa-spinner fa-spin' : 'fa-cloud'}`} /> {conditionsLoading ? 'Loading route conditions…' : 'Check weather, air quality and elevation'}
                </button> : <div className="small">
                  <div className="fw-bold mb-2">Route conditions <span className="text-muted fw-normal">(current conditions)</span></div>
                  <div className="mb-1"><strong>Origin weather:</strong> {getWeatherSummary(routeConditions.origin?.weather)}</div>
                  <div className="mb-1"><strong>Origin air:</strong> {getAqiSummary(routeConditions.origin?.airQuality)}</div>
                  <div className="mb-1"><strong>Destination weather:</strong> {getWeatherSummary(routeConditions.destination?.weather)}</div>
                  <div className="mb-1"><strong>Destination air:</strong> {getAqiSummary(routeConditions.destination?.airQuality)}</div>
                  {routeConditions.elevation && <div><strong>Elevation samples:</strong> {routeConditions.elevation.error || `${Math.round(routeConditions.elevation.minimumMeters)}–${Math.round(routeConditions.elevation.maximumMeters)} m across ${routeConditions.elevation.sampleCount} points`}</div>}
                  <button type="button" className="btn btn-link btn-sm p-0 mt-2" onClick={loadRouteConditions} disabled={conditionsLoading}>Refresh conditions</button>
                </div>}
              </div>}
            </div>
          )}

          <h3 className="mt-5 border-bottom pb-2">Expenses</h3>
          {expenses.map((exp, index) => (
            <div key={index} className="d-flex mb-2 gap-2">
              <select
                className="form-select form-select-sm"
                value={exp.type}
                onChange={(e) => handleExpenseChange(index, "type", e.target.value)}
              >
                <option value="">Select Expense</option>
                {expenseOptions.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Amount"
                value={exp.amount}
                onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
              />
              <button className="btn btn-outline-danger btn-sm" onClick={() => removeExpense(index)}>
                &times;
              </button>
            </div>
          ))}
          <button className="btn btn-outline-secondary btn-sm mt-2" onClick={addExpense}>
            + Add Expense
          </button>
        </div>

        <div className="col-md-8">
          <div className="bg-white p-2 rounded border" style={{ height: '100%', minHeight: '600px' }}>
            {!GOOGLE_MAPS_API_KEY ? (
              <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded text-center p-4">
                <span>Google Maps is not configured. Add REACT_APP_GOOGLE_MAPS_API_KEY to the React environment and restart the app.</span>
              </div>
            ) : loadError ? (
              <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded text-center p-4">
                <span>Google Maps could not load. Check the browser key, its referrer restrictions, and Maps JavaScript API access.</span>
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={markers.length > 0 ? markers[0] : center}
                zoom={markers.length > 0 ? 5 : 4}
                onLoad={onLoadMap}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false
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
                {nearbyPlaces.map((place) => <MarkerF key={`nearby-${place.id}`} position={{ lat: place.location.latitude, lng: place.location.longitude }} title={place.displayName?.text || 'Nearby service'} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />)}
              </GoogleMap>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded">
                <span className="fs-5 text-muted">Loading Map...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distancepopup;
