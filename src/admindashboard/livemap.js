import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BASE_URL } from '../config';

const mapStyle = {
  width: '100%',
  height: 'min(72vh, 760px)',
  minHeight: '420px',
};

const normalizeEntry = (entry, type) => {
  if (!entry || [entry.latitude ?? entry.lat, entry.longitude ?? entry.lng ?? entry.lon]
    .some(value => value === null || value === undefined || typeof value === 'boolean'
      || (typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '')) return null;
  const latitude = Number(entry.latitude ?? entry.lat);
  const longitude = Number(entry.longitude ?? entry.lng ?? entry.lon);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  ) {
    return null;
  }

  const driverName = [entry.fname, entry.lname].filter(Boolean).join(' ');
  const id = entry.driver_id || entry.truck_id || entry.id;
  return {
    id,
    type,
    label: entry.label || entry.plateno || entry.name || driverName || `${type} ${id || ''}`.trim(),
    latitude,
    longitude,
    lastSeen: entry.last_seen || '',
  };
};

const positionStatus = (item, now, error) => {
  const timestamp = Date.parse(item.lastSeen);
  return !error && Number.isFinite(timestamp) && timestamp <= now && now - timestamp <= 120000
    ? 'Recent' : 'Stale / unverified';
};

const TripMap = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eldError, setEldError] = useState('');
  const [now, setNow] = useState(Date.now());
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const hasFittedFleetRef = useRef(false);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return undefined;

    const leaflet = L;
    const map = leaflet.map(mapElementRef.current, { scrollWheelZoom: true }).setView([39.8283, -98.5795], 4);
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    markerLayerRef.current = leaflet.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let pending = false;
    let controller;

    const fetchFleet = async (showLoading = false) => {
      if (pending) return;
      pending = true;
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      if (showLoading && active) setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}api/liveFleetLocations`, {
          credentials: 'include', cache: 'no-store', signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Fleet API returned ${response.status}`);
        const data = await response.json();
        if (data.status !== 'success' || !Array.isArray(data.drivers) || !Array.isArray(data.trucks)) {
          throw new Error('Invalid fleet location response');
        }
        if (!active) return;

        const drivers = (Array.isArray(data.drivers) ? data.drivers : [])
          .map((entry) => normalizeEntry(entry, 'driver'))
          .filter(Boolean);
        const trucks = (Array.isArray(data.trucks) ? data.trucks : [])
          .map((entry) => normalizeEntry(entry, 'truck'))
          .filter(Boolean);
        setFleet([...drivers, ...trucks]);
        setNow(Date.now());
        setEldError(data.eld_error || '');
        setError('');
      } catch (fetchError) {
        if (!active) return;
        console.error('Live fleet locations could not be fetched:', fetchError);
        if (active) setError('Unable to load live locations. Check the API connection and try again.');
      } finally {
        window.clearTimeout(timeout);
        pending = false;
        if (showLoading && active) setLoading(false);
      }
    };

    fetchFleet(true);
    const interval = window.setInterval(() => fetchFleet(), 20000);
    return () => {
      active = false;
      if (controller) controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    const leaflet = L;
    const markerLayer = markerLayerRef.current;
    markerLayer.clearLayers();
    const bounds = [];

    fleet.forEach((item) => {
      const position = [item.latitude, item.longitude];
      const marker = leaflet.circleMarker(position, {
        radius: 9,
        color: '#ffffff',
        weight: 2,
        fillColor: item.type === 'truck' ? '#e58a16' : '#176b87',
        fillOpacity: positionStatus(item, now, error) === 'Recent' ? 1 : 0.35,
      });

      const popup = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.label;
      popup.appendChild(title);

      const kind = document.createElement('div');
      kind.textContent = item.type === 'truck' ? 'ELD truck' : 'Driver app';
      popup.appendChild(kind);

      const status = document.createElement('div');
      status.textContent = `Position: ${positionStatus(item, now, error)}`;
      popup.appendChild(status);

      if (item.lastSeen) {
        const lastSeen = document.createElement('div');
        lastSeen.textContent = `Last update: ${item.lastSeen}`;
        popup.appendChild(lastSeen);
      }

      marker.bindPopup(popup).addTo(markerLayer);
      bounds.push(position);
    });

    if (bounds.length && !hasFittedFleetRef.current) {
      if (bounds.length === 1) {
        mapRef.current.setView(bounds[0], 12);
      } else {
        mapRef.current.fitBounds(leaflet.latLngBounds(bounds), { padding: [32, 32], maxZoom: 12 });
      }
      hasFittedFleetRef.current = true;
    }
  }, [fleet, now, error]);

  const driverCount = fleet.filter((item) => item.type === 'driver').length;
  const truckCount = fleet.filter((item) => item.type === 'truck').length;

  return (
    <main className="content-wrapper p-3" style={{ minHeight: 500 }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Live Fleet Map</h2>
          <span className="text-muted">Polls every 20 seconds. Driver app GPS and ELD positions are separate sources.</span>
        </div>
        <div className="d-flex gap-3" aria-live="polite">
          <span><strong>{truckCount}</strong> trucks</span>
          <span><strong>{driverCount}</strong> drivers</span>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading live fleet locations...</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {eldError && <div className="alert alert-warning" role="alert">ELD locations unavailable: {eldError}</div>}
      {!loading && !error && fleet.length === 0 && (
        <div className="alert alert-warning" role="status">
          No driver or truck GPS locations have been received yet.
        </div>
      )}
      <div ref={mapElementRef} style={mapStyle} aria-label="Live truck and driver locations" />
      <div className="d-flex gap-4 mt-2" aria-label="Map legend">
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: '50%', background: '#e58a16', marginRight: 6 }} />Trucks</span>
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: '50%', background: '#176b87', marginRight: 6 }} />Driver app GPS</span>
        <span>Faded markers: older than 2 minutes or unverified.</span>
      </div>
      <p className="text-muted mt-2">Drivers must enable Share live location and allow GPS in their app.
        Mobile browsers may pause updates when closed or in the background. Times below are server receipt times.</p>
      {fleet.length > 0 && (
        <div className="table-responsive">
          <table className="table" aria-label="Fleet position updates">
            <thead><tr><th>Name</th><th>Source</th><th>Position</th><th>Last received (UTC)</th><th>GPS coordinates</th></tr></thead>
            <tbody>{fleet.map(item => (
              <tr key={`${item.type}-${item.id}`}>
                <td>{item.label}</td><td>{item.type === 'driver' ? 'Driver app GPS' : 'ELD truck'}</td>
                <td>{positionStatus(item, now, error)}</td><td>{item.lastSeen || 'Unknown'}</td>
                <td>{item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default TripMap;
