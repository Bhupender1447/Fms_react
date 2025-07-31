import { useEffect } from "react";

const AutoLiveLocationSender = () => {
  const sendLocation = (lat, lng) => {
    const { id } = JSON.parse(localStorage.getItem("logindetail") || "{}");
    const driverId = id;

    if (!driverId) return;

    fetch("https://isovia.ca/fms_api/api/getliveLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `lat=${lat}&long=${lng}&driverId=${driverId}`,
    })
      .then((res) => res.text())
      .then((data) => {
        console.log("Location sent:", data);
      })
      .catch(() => {
        console.log("Failed to send location.");
      });
  };

  const getLocationAndSend = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          sendLocation(latitude, longitude);
        },
        (err) => {
          console.log("Location error:", err.message);
        },
        {
          enableHighAccuracy: true,
           timeout: 60000,  
          maximumAge: 0,
        }
      );
    }
  };

  useEffect(() => {
    getLocationAndSend();
  }, []);

  return null; // no UI
};

export default AutoLiveLocationSender;
