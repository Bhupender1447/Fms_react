import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const AutoLiveLocationSender = () => {
  const [trackingEnabled, setTrackingEnabled] = useState(
    () => localStorage.getItem("driverLocationSharingEnabled") === "true"
  );
  const [trackingError, setTrackingError] = useState("");

  useEffect(() => {
    if (!trackingEnabled) return undefined;

    let driverId;
    try {
      driverId = JSON.parse(localStorage.getItem("logindetail") || "{}").id;
    } catch {
      return undefined;
    }
    if (!driverId || !navigator.geolocation) return undefined;

    let lastSentAt = 0;
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const now = Date.now();
        if (now - lastSentAt < 15000) return;
        lastSentAt = now;

        const body = new URLSearchParams({
          lat: String(coords.latitude),
          long: String(coords.longitude),
        });

        fetch(`${BASE_URL}api/getliveLocation`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        }).then((response) => {
          if (!response.ok) setTrackingError("Location update failed. Please sign in again or retry.");
          else setTrackingError("");
        }).catch(() => setTrackingError("Location update failed. Check your connection."));
      },
      (error) => setTrackingError(`Location unavailable: ${error.message}`),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [trackingEnabled]);

  const toggleTracking = () => {
    const next = !trackingEnabled;
    localStorage.setItem("driverLocationSharingEnabled", String(next));
    setTrackingError("");
    setTrackingEnabled(next);
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", color: "#fff", fontSize: 12 }}>
      <span aria-live="polite">
        {trackingError || (trackingEnabled ? "Live location sharing on" : "Live location sharing off")}
      </span>
      <button
        type="button"
        onClick={toggleTracking}
        className="btn btn-xs btn-default"
        aria-pressed={trackingEnabled}
      >
        {trackingEnabled ? "Stop sharing" : "Share live location"}
      </button>
    </div>
  );
};

export default AutoLiveLocationSender;
