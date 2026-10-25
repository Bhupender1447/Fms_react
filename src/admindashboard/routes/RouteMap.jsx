import React, { useEffect } from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const isCoordinate = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

function FitRouteBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) map.fitBounds(positions, { padding: [28, 28] });
  }, [map, positions]);
  return null;
}

export default function RouteMap({ stops = [], routePath = [], providerRoute = false }) {
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
  const roadPositions = routePath
    .filter((point) => Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng)))
    .map((point) => [Number(point.lat), Number(point.lng)]);
  const allPositions = roadPositions.length > 1 ? roadPositions : positions;
  return (
    <div className="route-map-shell" aria-label="Route stop map preview">
      <MapContainer center={center} zoom={8} scrollWheelZoom={false} className="route-map-canvas">
        <FitRouteBounds positions={allPositions} />
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {roadPositions.length > 1
          ? <Polyline positions={roadPositions} pathOptions={{ color: '#1769D2', weight: 5 }} />
          : <Polyline positions={positions} pathOptions={{ color: '#710D2D', weight: 4, dashArray: '7 6' }} />}
        {coordinates.map((stop, index) => (
          <CircleMarker key={stop.previewKey || stop.stopId || `stop-${index}`} center={stop.position} radius={8} pathOptions={{ color: '#fff', weight: 2, fillColor: stop.stopType === 'PICKUP' ? '#1769D2' : stop.stopType === 'DELIVERY' ? '#116D49' : '#805008', fillOpacity: 1 }}>
            <Tooltip>{`${index + 1}. ${stop.stopId || `Stop ${index + 1}`} · ${stop.stopType}`}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <p className="route-map-caption">{providerRoute ? 'PTV road geometry for the displayed stop order; the path is not a stop-order optimization or dispatch authorization.' : 'Schematic stop sequence only; no provider road route is available.'}</p>
    </div>
  );
}
