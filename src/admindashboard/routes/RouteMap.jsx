import React from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const isCoordinate = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

export default function RouteMap({ stops = [] }) {
  const coordinates = stops
    .filter((stop) => isCoordinate(stop.latitude) && isCoordinate(stop.longitude))
    .map((stop) => ({ ...stop, position: [Number(stop.latitude), Number(stop.longitude)] }));

  if (coordinates.length !== stops.length || coordinates.length < 2) {
    return (
      <div className="route-map-unavailable" role="status">
        <i className="fa fa-map-o" aria-hidden="true" />
        <strong>Map preview unavailable</strong>
        <span>Every stop needs verified coordinates. Geocoding is not run in this preview.</span>
        <span>{coordinates.length} of {stops.length} stops have coordinates.</span>
      </div>
    );
  }

  const center = coordinates[0].position;
  const positions = coordinates.map((stop) => stop.position);
  return (
    <div className="route-map-shell" aria-label="Route stop map preview">
      <MapContainer center={center} zoom={8} scrollWheelZoom={false} className="route-map-canvas">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={positions} pathOptions={{ color: '#710D2D', weight: 4, dashArray: '7 6' }} />
        {coordinates.map((stop, index) => (
          <CircleMarker key={stop.previewKey || stop.stopId || `stop-${index}`} center={stop.position} radius={8} pathOptions={{ color: '#fff', weight: 2, fillColor: stop.stopType === 'PICKUP' ? '#1769D2' : stop.stopType === 'DELIVERY' ? '#116D49' : '#805008', fillOpacity: 1 }}>
            <Tooltip>{`${index + 1}. ${stop.stopId || `Stop ${index + 1}`} · ${stop.stopType}`}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <p className="route-map-caption">Schematic stop sequence only; this is not a PTV-calculated road route.</p>
    </div>
  );
}
