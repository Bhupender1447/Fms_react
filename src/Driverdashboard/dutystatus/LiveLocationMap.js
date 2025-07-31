import React, { useRef, useState } from "react";

const LiveLocationMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [status, setStatus] = useState("Click the button to detect location");

  const loadGoogleMapScript = (callback) => {
    if (window.google && window.google.maps) {
      callback();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyBM3VgKsX8mEGsVYpSic7VLNKwEmZ7IABc";
      script.async = true;
      script.defer = true;
      script.onload = callback;
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
    const {id} = JSON.parse(localStorage.getItem("logindetail"))
  const driverId = id; 

  fetch("https://isovia.ca/fms_api/api/getliveLocation", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `lat=${lat}&long=${lng}&driverId=${driverId}`,
  })
    .then((res) => res.text())
    .then((data) => {
      setStatus(`Location sent: ${data}`);
    })
    .catch(() => {
      setStatus("Failed to send location.");
    });
};

  const handleLocationClick = () => {
    loadGoogleMapScript(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setStatus(`Latitude: ${latitude}, Longitude: ${longitude}`);
            initializeMap(latitude, longitude);
            sendLocation(latitude, longitude);
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
    });
  };

  return (
      <div className='content-wrapper p-4'>
      <h2>Live Location Tracker</h2>
      <button onClick={handleLocationClick}>📍 Get My Location</button>
      <p>{status}</p>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "500px", width: "100%", marginTop: "10px" }}
      ></div>
    </div>
  );
};

export default LiveLocationMap;
