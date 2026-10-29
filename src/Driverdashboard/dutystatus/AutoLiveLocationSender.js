import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const AutoLiveLocationSender = () => {
  const [driverId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("logindetail") || "{}").id || null;
    } catch {
      return null;
    }
  });
  const preferenceKey = `driverLocationSharingEnabled:${driverId}`;
  const [trackingEnabled, setTrackingEnabled] = useState(
    () => Boolean(driverId) && localStorage.getItem(preferenceKey) === "true"
  );
  const [trackingError, setTrackingError] = useState("");
  const [lastShared, setLastShared] = useState("");

  useEffect(() => {
    if (!trackingEnabled) return undefined;
    if (!driverId || !navigator.geolocation) {
      setTrackingError(!driverId ? "Sign in as a driver to share location." : "Location is not supported by this browser.");
      return undefined;
    }

    let active = true;
    let pending = false;
    let controller;
    const updateLocation = () => {
      if (pending) return;
      pending = true;
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          if (!active) return;
          controller = new AbortController();
          const timeout = window.setTimeout(() => controller.abort(), 15000);
          try {
            const response = await fetch(`${BASE_URL}api/getliveLocation`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({ lat: String(coords.latitude), long: String(coords.longitude) }),
              signal: controller.signal,
            });
            const data = await response.json();
            if (!response.ok || data.status !== "success") {
              throw new Error(data.message || "Location update failed. Please sign in again or retry.");
            }
            if (active) {
              setTrackingError("");
              setLastShared(new Date().toLocaleTimeString());
            }
          } catch (error) {
            if (active) setTrackingError(error.name === "AbortError"
              ? "Location update timed out. Retrying with the next GPS position."
              : error.message || "Location update failed. Check your connection.");
          } finally {
            window.clearTimeout(timeout);
            pending = false;
          }
        },
        (error) => {
          pending = false;
          if (active) setTrackingError(`Location unavailable: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    };
    updateLocation();
    const interval = window.setInterval(updateLocation, 20000);

    return () => {
      active = false;
      if (controller) controller.abort();
      window.clearInterval(interval);
    };
  }, [trackingEnabled, driverId]);

  const toggleTracking = () => {
    const next = !trackingEnabled;
    if (!driverId) {
      setTrackingError("Sign in as a driver to share location.");
      return;
    }
    localStorage.setItem(preferenceKey, String(next));
    setTrackingError("");
    setLastShared("");
    setTrackingEnabled(next);
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", color: "#fff", fontSize: 12 }}>
      <span aria-live="polite">
        {trackingError || (trackingEnabled
          ? (lastShared ? `Location shared at ${lastShared}` : "Waiting for GPS permission and position...")
          : "Live location sharing off")}
      </span>
      <button
        type="button"
        onClick={toggleTracking}
        className="btn btn-xs btn-default"
        aria-pressed={trackingEnabled}
      >
        {trackingEnabled ? "Stop sharing" : "Share live location"}
      </button>
      <span>While this app is open; refreshes every 20 seconds.</span>
    </div>
  );
};

export default AutoLiveLocationSender;
