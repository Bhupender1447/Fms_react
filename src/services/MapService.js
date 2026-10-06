import axios from 'axios';
import { BASE_URL } from '../config';

/**
 * MapService acts as the abstraction layer for all map-related backend calls.
 * This ensures the frontend doesn't need to know if Google or PTV is being used.
 * The backend determines the correct provider based on the operation.
 */
class MapService {
  /**
   * Geocode an address to coordinates
   */
  static async geocode(address) {
    try {
      const response = await axios.post(`${BASE_URL}mapsapi/geocode`, { address });
      if (response.data && response.data.status === false) {
        throw new Error(response.data.message || "Failed to geocode address");
      }
      return response.data;
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to geocode address");
    }
  }

  /**
   * Calculate a unified route. 
   * If vehicle is provided and is a truck, the backend will use PTV.
   * Otherwise, it will use Google.
   */
  static async getRoute(origin, destination, waypoints = [], vehicle = null) {
    try {
      const payload = {
        origin,
        destination,
        waypoints,
        vehicle, // if null, backend defaults to standard car (Google Maps)
      };
      const response = await axios.post(`${BASE_URL}mapsapi/route`, payload);
      if (response.data && response.data.status === false) {
        throw new Error(response.data.message || response.data.error || "Failed to calculate route");
      }
      return response.data;
    } catch (error) {
      console.error("Routing error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to calculate route");
    }
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
  static async getPlaces(query) {
    try {
      const response = await axios.get(`${BASE_URL}mapsapi/places`, { params: { query } });
      return response.data;
    } catch (error) {
      console.error("Places API error:", error);
      throw new Error("Failed to fetch place predictions");
    }
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
