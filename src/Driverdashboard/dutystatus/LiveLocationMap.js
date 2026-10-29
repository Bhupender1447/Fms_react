import React, { useRef, useState } from "react";
import { BASE_URL } from "../../config";
import { GOOGLE_MAPS_API_KEY } from "../../mapConfig";

const LiveLocationMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [status, setStatus] = useState("Click the button to detect location");
  const [mapError, setMapError] = useState("");

  const loadGoogleMapScript = (callback) => {
    if (window.google && window.google.maps) {
      callback();
    } else if (!GOOGLE_MAPS_API_KEY) {
      setMapError("Google Maps is not configured. GPS sharing does not require the map.");
    } else {
      const script = document.createElement("script");
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      script.onerror = () => setMapError("Google Maps failed to load. GPS sharing does not require the map.");
      document.head.appendChild(script);
    }
  };

  const initializeMap = (lat, lng) => {
    const position = { lat, lng };

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
      });

      markerInstance.current = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title: "You are here",
      });
    } else {
      mapInstance.current.setCenter(position);
      markerInstance.current.setPosition(position);
    }
  };

  const sendLocation = (lat, lng) => {
    fetch(`${BASE_URL}api/getliveLocation`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `lat=${lat}&long=${lng}`,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.status !== "success") throw new Error(data.message || "Location update failed");
        setStatus("Location shared with dispatch.");
      })
      .catch((error) => {
        setStatus(error.message || "Failed to send location.");
      });
  };

  const handleLocationClick = () => {
    if ("geolocation" in navigator) {
      setStatus("Getting your location...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          sendLocation(latitude, longitude);
          loadGoogleMapScript(() => initializeMap(latitude, longitude));
        },
        (err) => setStatus("Error: " + err.message),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setStatus("Geolocation not supported.");
    }
  };

  return (
    <div className='content-wrapper p-4'>
      <h2>Live Location Tracker</h2>
      <button onClick={handleLocationClick}>📍 Get My Location</button>
      <p>{status}</p>
      {mapError && <p role="alert">{mapError}</p>}
      <p>Use Share live location in the header for automatic updates while this app is open.
        Your last shared position remains visible to dispatch with its update time.</p>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "500px", width: "100%", marginTop: "10px" }}
      ></div>
    </div>
  );
};

export default LiveLocationMap;
