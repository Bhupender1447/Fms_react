import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const TripViewer = () => {
  const { tripId } = useParams(); // Get trip ID from URL
  const [tripUrl, setTripUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
  
      try {
        const response = await axios.get(
          `https://tripmanagement.trimblemaps.com/api/trip/${tripId}/viewer/url`,
          {
            headers: {
              Authorization: "D487078091664D428AA781953AE84DF1",
              "Content-Type": "application/json",
              Cookie: "ASP.NET_SessionId=cx001fyj3yu2a0tysgi323sv",
            },
          }
        );
        setTripUrl(response.data.url); // Update this if the response key is different
      } catch (err) {
        setError(err);
      }
    };

    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  if (error) {
    return <div className="alert alert-danger">Error: {error.message}</div>;
  }

  return (
    <div className="content-wrapper">
      {tripUrl ? (
        <iframe
          src={tripUrl}
          title="Trip Viewer"
          className="w-100 vh-100 border-0"
        />
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <p className="text-lg font-weight-bold">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default TripViewer;
