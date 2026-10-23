import React, { useEffect, useState, useRef } from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import MapService from '../../services/MapService';
import 'leaflet/dist/leaflet.css';

const isCoordinate = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

function MapBoundsSetter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (!positions || positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 12);
    } else {
      map.fitBounds(positions, { padding: [30, 30] });
    }
  }, [positions, map]);
  return null;
}

const geocodeSingleAddress = async (address) => {
  if (!address || !String(address).trim()) return null;
  const cleanAddr = String(address).trim();

  // 1. Try Google Maps Geocoder if loaded in window
  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const res = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: cleanAddr }, (results, status) => {
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            resolve({
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng(),
            });
          } else {
            reject(new Error(status));
          }
        });
      });
      if (res) return res;
    } catch (e) {
      // Continue to next fallback
    }
  }

  // 2. Try MapService backend
  try {
    const backendRes = await MapService.geocode(cleanAddr);
    if (backendRes && isCoordinate(backendRes.lat) && isCoordinate(backendRes.lng)) {
      return {
        latitude: Number(backendRes.lat),
        longitude: Number(backendRes.lng),
      };
    }
  } catch (e) {
    // Continue to next fallback
  }

  // 3. Try OpenStreetMap Nominatim
  try {
    const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddr)}&limit=1`, {
      headers: { 'Accept': 'application/json' }
    });
    const osmData = await osmRes.json();
    if (osmData && osmData[0]) {
      return {
        latitude: parseFloat(osmData[0].lat),
        longitude: parseFloat(osmData[0].lon),
      };
    }
  } catch (e) {
    // Geocoding unavailable
  }

  return null;
};

export default function RouteMap({ stops = [], onStopsGeocoded }) {
  const [internalStops, setInternalStops] = useState(stops);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodedRef = useRef(false);

  useEffect(() => {
    setInternalStops(stops);
  }, [stops]);

  useEffect(() => {
    const unlocatedStops = internalStops.filter(
      (s) => (!isCoordinate(s.latitude) || !isCoordinate(s.longitude)) && (s.address || s.city)
    );

    if (unlocatedStops.length > 0 && !geocodedRef.current) {
      geocodedRef.current = true;
      setIsGeocoding(true);

      const resolveAll = async () => {
        const updated = await Promise.all(
          internalStops.map(async (stop) => {
            if (isCoordinate(stop.latitude) && isCoordinate(stop.longitude)) {
              return stop;
            }
            const addressString = [stop.address, stop.city, stop.region, stop.postalCode]
              .filter(Boolean)
              .join(', ');
            if (!addressString) return stop;

            const coords = await geocodeSingleAddress(addressString);
            if (coords) {
              return { ...stop, latitude: coords.latitude, longitude: coords.longitude };
            }
            return stop;
          })
        );

        setInternalStops(updated);
        setIsGeocoding(false);
        if (onStopsGeocoded) {
          onStopsGeocoded(updated);
        }
      };

      resolveAll();
    }
  }, [internalStops, onStopsGeocoded]);

  const coordinates = internalStops
    .filter((stop) => isCoordinate(stop.latitude) && isCoordinate(stop.longitude))
    .map((stop) => ({ ...stop, position: [Number(stop.latitude), Number(stop.longitude)] }));

  if (isGeocoding) {
    return (
      <div className="route-map-shell p-4 text-center bg-light rounded" role="status">
        <i className="fa fa-spinner fa-spin fa-2x text-primary mb-2" />
        <p className="mb-0 fw-bold">Locating stop addresses on map...</p>
        <small className="text-muted">Resolving street coordinates for map preview.</small>
      </div>
    );
  }

  if (coordinates.length === 0) {
    return (
      <div className="route-map-unavailable" role="status">
        <i className="fa fa-map-o" aria-hidden="true" />
        <strong>Map preview unavailable</strong>
        <span>No coordinates could be found for the entered stops. Enter street addresses or verify your location inputs.</span>
        <span>0 of {internalStops.length} stops have coordinates.</span>
      </div>
    );
  }

  const center = coordinates[0].position;
  const positions = coordinates.map((stop) => stop.position);

  return (
    <div className="route-map-shell" aria-label="Route stop map preview">
      <MapContainer center={center} zoom={coordinates.length === 1 ? 12 : 8} scrollWheelZoom={false} className="route-map-canvas">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapBoundsSetter positions={positions} />
        {positions.length >= 2 && (
          <Polyline positions={positions} pathOptions={{ color: '#710D2D', weight: 4, dashArray: '7 6' }} />
        )}
        {coordinates.map((stop, index) => (
          <CircleMarker
            key={stop.previewKey || stop.stopId || `stop-${index}`}
            center={stop.position}
            radius={8}
            pathOptions={{
              color: '#fff',
              weight: 2,
              fillColor: stop.stopType === 'PICKUP' ? '#1769D2' : stop.stopType === 'DELIVERY' ? '#116D49' : '#805008',
              fillOpacity: 1,
            }}
          >
            <Tooltip>{`${index + 1}. ${stop.customer || stop.stopId || `Stop ${index + 1}`} · ${stop.stopType || 'STOP'}`}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <p className="route-map-caption">
        {coordinates.length < internalStops.length
          ? `Showing ${coordinates.length} of ${internalStops.length} stops with resolved coordinates.`
          : 'Schematic stop sequence preview.'}
      </p>
    </div>
  );
}
