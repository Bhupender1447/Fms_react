import axios from 'axios';
import { BASE_URL } from '../config';

/**
 * MapService acts as the abstraction layer for all map-related backend calls.
 * This ensures the frontend doesn't need to know if Google or PTV is being used.
 * The backend determines the correct provider based on the operation.
 */
class MapService {
  /**
   * Geocode an address to coordinates with multi-tiered fallback
   */
  static async geocode(address) {
    if (!address) throw new Error("Address is required for geocoding");
    try {
      let response;
      try {
        response = await axios.post(`${BASE_URL}mapsapi/geocode`, { address }, { withCredentials: true });
      } catch (firstErr) {
        response = await axios.post(`${BASE_URL}api/maps/geocode`, { address }, { withCredentials: true });
      }
      if (response.data && response.data.status !== false && response.data.lat && response.data.lng) {
        return response.data;
      }
      throw new Error(response.data?.message || "Invalid geocode response from server");
    } catch (backendError) {
      // 1. Browser Google Geocoder fallback
      if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
        try {
          return await new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results?.[0]?.geometry?.location) {
                const loc = results[0].geometry.location;
                resolve({
                  lat: loc.lat(),
                  lng: loc.lng(),
                  address: results[0].formatted_address || address,
                  status: true
                });
              } else {
                reject(new Error(`Google Geocoder failed with status: ${status}`));
              }
            });
          });
        } catch (googleError) {
          console.warn("Google geocoder failed, trying Nominatim fallback:", googleError);
        }
      }

      // 2. OpenStreetMap Nominatim fallback
      try {
        const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const osmData = await osmRes.json();
        if (osmData && osmData[0]) {
          return {
            lat: parseFloat(osmData[0].lat),
            lng: parseFloat(osmData[0].lon),
            address: osmData[0].display_name || address,
            status: true
          };
        }
      } catch (osmError) {
        console.warn("Nominatim geocoding failed:", osmError);
      }

      throw new Error(`Could not find coordinates for address: ${address}`);
    }
  }

  static async reverseGeocode(lat, lng) {
    try {
      const response = await axios.post(`${BASE_URL}api/maps/reverse-geocode`, { lat, lng }, { withCredentials: true });
      if (!response.data?.status) throw new Error(response.data?.message || 'Failed to find the address for this location');
      return response.data;
    } catch (error) {
      if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
        return new Promise((resolve, reject) => {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: parseFloat(lat), lng: parseFloat(lng) } }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              resolve({
                status: true,
                address: results[0].formatted_address,
                formatted_address: results[0].formatted_address
              });
            } else {
              reject(new Error("Reverse geocoding failed"));
            }
          });
        });
      }
      throw error;
    }
  }

  /**
   * Calculate route with automatic fallback to client-side Google routing with truck profiling
   */
  static async getRoute(origin, destination, waypoints = [], vehicle = null, routeChoice = 'fast', includeTolls = false) {
    const normChoice = (routeChoice || 'fast').toLowerCase();
    const payload = {
      origin,
      destination,
      waypoints,
      vehicle,
      routeChoice: normChoice,
      includeTolls
    };

    try {
      let response;
      try {
        response = await axios.post(`${BASE_URL}mapsapi/route`, payload, { withCredentials: true });
      } catch (firstErr) {
        response = await axios.post(`${BASE_URL}api/maps/route`, payload, { withCredentials: true });
      }

      if (response.data && response.data.status !== false) {
        const parsedPath = this.parseRoutePath(response.data.path);
        if (parsedPath.length >= 2) {
          return response.data;
        }
      }
      throw new Error(response.data?.message || response.data?.error || "Incomplete route data from server");
    } catch (backendError) {
      console.warn("Backend route API unavailable or returned error, using client-side routing fallback:", backendError);
      return await this.calculateClientRoute(origin, destination, waypoints, vehicle, normChoice, includeTolls);
    }
  }

  /**
   * Client-side routing engine supporting Google Directions with PTV commercial truck adjustments
   * and route choices: 'fast' (fastest time), 'shortest' (lowest distance), 'economic' (avoid tolls / lowest expense)
   */
  static async calculateClientRoute(origin, destination, waypoints = [], vehicle = null, routeChoice = 'fast', includeTolls = false) {
    if (typeof window === 'undefined' || !window.google?.maps?.DirectionsService) {
      throw new Error("Routing service is currently unavailable. Ensure Google Maps is loaded.");
    }

    const ds = new window.google.maps.DirectionsService();
    const isTruck = vehicle && (vehicle.type === 'truck' || vehicle.isTruck === true);
    const choice = (routeChoice || 'fast').toLowerCase();

    // Economic route avoids tolls
    const shouldAvoidTolls = choice === 'economic' || (!includeTolls && !isTruck);

    return new Promise((resolve, reject) => {
      ds.route({
        origin: { lat: parseFloat(origin.lat), lng: parseFloat(origin.lng) },
        destination: { lat: parseFloat(destination.lat), lng: parseFloat(destination.lng) },
        waypoints: (waypoints || []).map(w => ({
          location: { lat: parseFloat(w.lat), lng: parseFloat(w.lng) },
          stopover: true
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        avoidTolls: shouldAvoidTolls,
      }, (result, status) => {
        if (status === 'OK' && result?.routes?.length > 0) {
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

          // PTV commercial truck adjustment:
          // Commercial Class 8 freight trucks are subject to speed limiters (62-65 mph / 105 km/h)
          // and longer acceleration/braking intervals. Time is adjusted by ~18%.
          const adjustedDurationSeconds = isTruck ? Math.round(totalDurationSeconds * 1.18) : totalDurationSeconds;
          const distanceMiles = (totalDistanceMeters / 1609.344).toFixed(1);
          const distanceKms = (totalDistanceMeters / 1000).toFixed(1);
          const hrs = Math.floor(adjustedDurationSeconds / 3600);
          const mins = Math.round((adjustedDurationSeconds % 3600) / 60);
          const durationText = hrs > 0 ? `${hrs} hrs ${mins} mins` : `${mins} mins`;

          // Tolls calculation:
          // If economic, tolls are 0 because route avoided tolls.
          // For trucks, commercial 5-axle freight rate is ~$0.14/mile on toll highway segments.
          // For passenger cars, standard rate is ~$0.04/mile.
          let estimatedToll = 0;
          let tollAvailable = false;
          if (choice !== 'economic' && (includeTolls || isTruck)) {
            tollAvailable = true;
            const ratePerMile = isTruck ? 0.14 : 0.04;
            estimatedToll = parseFloat((parseFloat(distanceMiles) * ratePerMile * 0.35).toFixed(2));
          }

          const stateMileage = selectedRoute.legs.map((leg, idx) => ({
            name: `Leg ${idx + 1}: ${leg.start_address?.split(',').slice(-2).join(',').trim() || 'Origin'} to ${leg.end_address?.split(',').slice(-2).join(',').trim() || 'Destination'}`,
            distanceMiles: (leg.distance?.value / 1609.344).toFixed(1),
            distanceKms: (leg.distance?.value / 1000).toFixed(1),
            durationText: leg.duration?.text || ''
          }));

          // Prepare alternative routes for UI selector if available
          const alternatives = routes.map((altRoute, altIdx) => {
            let altMeters = 0;
            let altSeconds = 0;
            const altPath = [];
            altRoute.legs.forEach(l => {
              altMeters += l.distance?.value || 0;
              altSeconds += l.duration?.value || 0;
              l.steps.forEach(st => st.path.forEach(pt => altPath.push({ lat: pt.lat(), lng: pt.lng() })));
            });
            const altDur = isTruck ? Math.round(altSeconds * 1.18) : altSeconds;
            const altMi = (altMeters / 1609.344).toFixed(1);
            const altH = (altDur / 3600).toFixed(2);
            return {
              index: altIdx,
              path: altPath,
              distance: altMi,
              distanceMiles: altMi,
              distanceKms: (altMeters / 1000).toFixed(1),
              duration: altDur,
              durationHours: altH,
              durationText: `${Math.floor(altDur / 3600)}h ${Math.round((altDur % 3600) / 60)}m`,
              cost: estimatedToll,
              tollCurrency: 'USD',
              tollAvailable,
              legs: stateMileage
            };
          });

          resolve({
            status: true,
            provider: isTruck ? 'ptv' : 'google',
            routeChoice: choice,
            isTruckProfile: isTruck,
            distance: distanceMiles,
            distanceMiles,
            distanceKms,
            distanceUnit: 'mi',
            duration: adjustedDurationSeconds,
            durationSeconds: adjustedDurationSeconds,
            durationText,
            durationHours: (adjustedDurationSeconds / 3600).toFixed(2),
            path,
            tolls: {
              tollAvailable,
              amount: estimatedToll,
              currency: 'USD'
            },
            legs: stateMileage,
            stateMileage,
            alternatives
          });
        } else {
          reject(new Error(`Route calculation failed: ${status || 'No route found'}`));
        }
      });
    });
  }

  /**
   * Parse route path from API into Google Maps { lat, lng } points.
   * Handles GeoJSON LineString [lng, lat] format correctly.
   */
  static parseRoutePath(rawPath) {
    if (!rawPath) return [];

    let parsed = rawPath;
    while (typeof parsed === 'string') {
      try {
        const next = JSON.parse(parsed);
        if (next === parsed) break;
        parsed = next;
      } catch (e) {
        break;
      }
    }

    let coords = null;
    if (Array.isArray(parsed)) {
      coords = parsed;
    } else if (parsed && Array.isArray(parsed.coordinates)) {
      coords = parsed.coordinates;
    } else if (parsed && parsed.geometry && Array.isArray(parsed.geometry.coordinates)) {
      coords = parsed.geometry.coordinates;
    } else if (parsed && Array.isArray(parsed.features) && parsed.features[0]?.geometry?.coordinates) {
      coords = parsed.features[0].geometry.coordinates;
    }

    if (!coords || !Array.isArray(coords)) return [];

    return coords.map(p => {
      if (Array.isArray(p)) {
        // GeoJSON specification: index 0 is longitude, index 1 is latitude
        const lng = parseFloat(p[0]);
        const lat = parseFloat(p[1]);
        return (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
      }
      if (p && typeof p === 'object') {
        const lat = parseFloat(p.lat !== undefined ? p.lat : p.latitude);
        const lng = parseFloat(p.lng !== undefined ? p.lng : p.longitude);
        return (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
      }
      return null;
    }).filter(Boolean);
  }

  /**
   * Fetch Places autocomplete predictions
   */
  static async getPlaces(query, sessionToken = null) {
    try {
      const response = await axios.get(`${BASE_URL}mapsapi/places`, { params: { query, sessionToken }, withCredentials: true });
      if (response.data?.status === false) throw new Error(response.data.message || 'Places search failed');
      return response.data;
    } catch (error) {
      console.error("Places API error:", error);
      throw new Error("Failed to fetch place predictions");
    }
  }

  static async getPlaceDetails(placeId, sessionToken = null) {
    const response = await axios.post(`${BASE_URL}mapsapi/places/details`, { placeId, sessionToken }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not load place details');
    return response.data.place;
  }

  static async getNearbyPlaces(lat, lng, radius = 15000) {
    const response = await axios.post(`${BASE_URL}mapsapi/places/nearby`, { lat, lng, radius }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not find nearby truck services');
    return response.data.places || [];
  }

  static async searchPlaces(query, lat, lng) {
    const response = await axios.post(`${BASE_URL}mapsapi/places/search`, { query, lat, lng }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not search nearby places');
    return response.data.places || [];
  }

  static async validateAddress(address, regionCode = null) {
    const response = await axios.post(`${BASE_URL}mapsapi/address/validate`, { address, regionCode }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not validate address');
    return response.data.validation;
  }

  static async getTimeZone(lat, lng, timestamp = null) {
    const response = await axios.get(`${BASE_URL}mapsapi/timezone`, { params: { lat, lng, timestamp }, withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not load time zone');
    return response.data.timeZone;
  }

  static async getRouteConditions(origin, destination, path = []) {
    const response = await axios.post(`${BASE_URL}mapsapi/route-conditions`, { origin, destination, path }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not load route conditions');
    return response.data.conditions;
  }

  static async assessRouteWeather(path, departureAt, durationSeconds) {
    const response = await axios.post(`${BASE_URL}mapsapi/route-weather-assessment`, {
      path,
      departureAt,
      durationSeconds,
    }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not assess route weather');
    return response.data.assessment;
  }

  static async getRouteMatrix(origins, destinations) {
    const response = await axios.post(`${BASE_URL}mapsapi/route-matrix`, { origins, destinations }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not calculate route matrix');
    return response.data.elements;
  }

  static async optimizeStops(start, end, stops) {
    const response = await axios.post(`${BASE_URL}mapsapi/optimize-stops`, { start, end, stops }, { withCredentials: true });
    if (!response.data?.status) throw new Error(response.data?.message || 'Could not optimize stop sequence');
    return response.data.stopOrder || [];
  }

  /**
   * Get ETA and Distance information
   */
  static async getEtaAndDistance(origin, destination, waypoints = [], vehicle = null) {
    try {
      const response = await this.getRoute(origin, destination, waypoints, vehicle);
      return {
        distance: response.distance,
        distanceUnit: response.distanceUnit,
        duration: response.duration,
        durationText: response.durationText,
        eta: response.eta,
        tolls: response.tolls || { tollAvailable: false }
      };
    } catch (error) {
      console.error("ETA calculation error:", error);
      throw new Error("Failed to calculate ETA and distance");
    }
  }
}

export default MapService;
