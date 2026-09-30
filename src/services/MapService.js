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
      return response.data;
    } catch (error) {
      console.error("Routing error:", error);
      throw new Error(error.response?.data?.message || "Failed to calculate route");
    }
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
