import React, { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '../config';

const mapStyle = {
  width: '100%',
  height: 'min(72vh, 760px)',
  minHeight: '420px',
};

const normalizeEntry = (entry, type) => {
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
    status: entry.status || 'Live',
    lastSeen: entry.last_seen || (entry.date && entry.time ? `${entry.date} ${entry.time}` : ''),
  };
};

const TripMap = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eldError, setEldError] = useState('');
  const [leafletReady, setLeafletReady] = useState(Boolean(window.L));
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const hasFittedFleetRef = useRef(false);

  useEffect(() => {
    if (window.L) {
      setLeafletReady(true);
      return undefined;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletReady(true);
    script.onerror = () => setError('Map library failed to load. Check the network connection and reload.');
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapElementRef.current || mapRef.current) return undefined;

    const leaflet = window.L;
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
  }, [leafletReady]);

  useEffect(() => {
    let active = true;

    const fetchFleet = async (showLoading = false) => {
      if (showLoading && active) setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}api/liveFleetLocations`, { credentials: 'include' });
        if (!response.ok) throw new Error(`Fleet API returned ${response.status}`);
        const data = await response.json();
        if (!active) return;

        const drivers = (Array.isArray(data.drivers) ? data.drivers : [])
          .map((entry) => normalizeEntry(entry, 'driver'))
          .filter(Boolean);
        const trucks = (Array.isArray(data.trucks) ? data.trucks : [])
          .map((entry) => normalizeEntry(entry, 'truck'))
          .filter(Boolean);
        setFleet([...drivers, ...trucks]);
        setEldError(data.eld_error || '');
        setError('');
      } catch (fetchError) {
        console.error('Live fleet locations could not be fetched:', fetchError);
        if (active) setError('Unable to load live locations. Check the API connection and try again.');
      } finally {
        if (showLoading && active) setLoading(false);
      }
    };

    fetchFleet(true);
    const interval = window.setInterval(() => fetchFleet(), 20000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current || !window.L) return;

    const leaflet = window.L;
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
        fillOpacity: 1,
      });

      const popup = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.label;
      popup.appendChild(title);

      const kind = document.createElement('div');
      kind.textContent = item.type === 'truck' ? 'ELD truck' : 'Driver app';
      popup.appendChild(kind);

      const status = document.createElement('div');
      status.textContent = `Status: ${item.status}`;
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
  }, [fleet, leafletReady]);

  const driverCount = fleet.filter((item) => item.type === 'driver').length;
  const truckCount = fleet.filter((item) => item.type === 'truck').length;

  return (
    <main className="content-wrapper p-3" style={{ minHeight: 500 }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Live Fleet Map</h2>
          <span className="text-muted">Updated automatically every 20 seconds</span>
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
      {!leafletReady && !error && <div className="alert alert-info">Loading map...</div>}

      <div ref={mapElementRef} style={mapStyle} aria-label="Live truck and driver locations" />
      <div className="d-flex gap-4 mt-2" aria-label="Map legend">
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: '50%', background: '#e58a16', marginRight: 6 }} />Trucks</span>
        <span><i style={{ display: 'inline-block', width: 11, height: 11, borderRadius: '50%', background: '#176b87', marginRight: 6 }} />Drivers</span>
      </div>
    </main>
  );
};

export default TripMap;
