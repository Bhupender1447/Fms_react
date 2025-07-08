import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

const Dutylist = () => {
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [locations, setLocations] = useState({});
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });

  const [formData, setFormData] = useState({
    duty_status: "",
    notes: "",
    images: null,
  });

  const sigRef = useRef(null);
  const [signatureData, setSignatureData] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      return date.toLocaleString("en-US", options);
    } catch {
      return "Invalid Date";
    }
  };

  const getAddressFromLatLng = async (lat, lng, tripId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBM3VgKsX8mEGsVYpSic7VLNKwEmZ7IABc`
      );
      if (response.data.results.length > 0) {
        setLocations((prev) => ({ 
          ...prev, 
          [tripId]: response.data.results[0].formatted_address 
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding error", error);
      setLocations((prev) => ({ 
        ...prev, 
        [tripId]: "Location not available" 
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setMessage("Error: Could not get current location");
        }
      );
    } else {
      setMessage("Error: Geolocation is not supported by this browser");
    }
  };

  const handleStatusChange = async (tripId, currentStatus) => {
    setUpdating(true);
    try {
      await axios.post(
        "https://isovia.ca/fms_api/api/toggleDutyStatus",
        { trip_id: tripId },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.trip_id === tripId
            ? { ...trip, status: currentStatus === "on" ? "off" : "on" }
            : trip
        )
      );

      setMessage("Status updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Failed to update status";
      setMessage("Error: " + errMsg);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateClick = (trip) => {
    setSelectedTrip(trip);
    setFormData({
      duty_status: trip.status || "off",
      notes: "",
      images: null,
    });
    setSignatureData("");
    if (sigRef.current) sigRef.current.clear();
    getCurrentLocation();
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const driver = JSON.parse(localStorage.getItem("logindetail"));
      const formPayload = new FormData();
      formPayload.append("driver_id", driver.id);
      formPayload.append("trip_id", selectedTrip.trip_id);
      formPayload.append("duty_status", formData.duty_status);
      formPayload.append("notes", formData.notes);
      
      // Add current location to the form data
      if (currentLocation.lat && currentLocation.lng) {
        formPayload.append("latitude", currentLocation.lat);
        formPayload.append("longitude", currentLocation.lng);
      }

      if (formData.images) {
        Array.from(formData.images).forEach((file) => {
          formPayload.append("images[]", file);
        });
      }

      if (sigRef.current && !sigRef.current.isEmpty()) {
        const signatureURL = sigRef.current.toDataURL("image/png");
        const signatureBlob = await (await fetch(signatureURL)).blob();
        formPayload.append("images[]", signatureBlob, "signature.png");
      }

      await axios.post("https://isovia.ca/fms_api/api/update_trip", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const response = await axios.get(
        `https://isovia.ca/fms_api/api/list_trips?driver_id=${driver.id}`
      );
      setTrips(response.data.data);

      setMessage("Trip updated successfully");
      setShowUpdateModal(false);
      setSignatureData("");
      if (sigRef.current) sigRef.current.clear();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Failed to update trip";
      setMessage("Error: " + errMsg);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driver = JSON.parse(localStorage.getItem("logindetail"));
        if (!driver?.id) {
          setMessage("Error: No driver logged in");
          return;
        }

        const response = await axios.get(
          `https://isovia.ca/fms_api/api/list_trips?driver_id=${driver.id}`
        );
        setTrips(response.data.data);

        // Fetch locations from lat/lng
        response.data.data.forEach((trip) => {
          if (trip.latitude && trip.longitude) {
            getAddressFromLatLng(trip.latitude, trip.longitude, trip.trip_id);
          }
        });
      } catch (error) {
        const errMsg =
          error.response?.data?.message || error.message || "Failed to fetch trips";
        setMessage("Error: " + errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content-wrapper p-4">
      <h4 className="mb-4">Duty History</h4>

      {message && (
        <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`}>
          {message}
        </div>
      )}

      {showUpdateModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Trip #{selectedTrip?.trip_id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  {/* Current Location Display */}
                  <div className="mb-3">
                    <label className="form-label">Current Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        currentLocation.lat && currentLocation.lng
                          ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`
                          : "Fetching location..."
                      }
                      disabled
                    />
                    <small className="text-muted">Your current GPS coordinates</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Duty Status</label>
                    <select
                      className="form-select"
                      value={formData.duty_status}
                      onChange={(e) =>
                        setFormData({ ...formData, duty_status: e.target.value })
                      }
                      required
                    >
                      <option value="">-- Select Status --</option>
                      <option value="trip_start">Trip Start</option>
                      <option value="break">Break</option>
                      <option value="trip_end">Trip End</option>
                      <option value="fuel-filling">Fuel Time</option>
                      <option value="additionally">Additionally</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows="4"
                      placeholder="Enter additional details"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Images (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, images: e.target.files })
                      }
                    />
                    <small className="text-muted">You can select multiple images</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Driver Signature (Optional)</label>
                    <div style={{ border: "2px solid #000", borderRadius: "5px" }}>
                      <SignatureCanvas
                        ref={sigRef}
                        penColor="black"
                        canvasProps={{
                          width: 500,
                          height: 200,
                          className: "signature-canvas",
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm mt-2"
                      onClick={() => {
                        sigRef.current.clear();
                        setSignatureData("");
                      }}
                    >
                      Clear Signature
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={updating}>
                    {updating ? "Updating..." : "Update Trip"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Trip ID</th>
                <th>Login Time</th>
                <th>Logout Time</th>
                <th>Status</th>
                <th>Details</th>
                <th>Notes</th>
                <th>Images</th>
                <th>Signature</th>
                <th>View Chart</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.trip_id}>
                  <td>{trip.trip_id}</td>
                  <td>{formatDate(trip.login_time)}</td>
                  <td>{formatDate(trip.logout_time)}</td>
                  <td>
                    <span
                      className={`badge ${trip.status === "on" ? "bg-success" : "bg-secondary"}`}
                    >
                      {trip.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ maxWidth: "200px", whiteSpace: "pre-wrap" }}>
                    {trip.motive_log.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {trip.motive_log.map((log, i) => (
                          <li key={i}>
                            <strong>{formatDate(log.trigger_time)}:</strong>
                            <br />
                            {log.details}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No details available"
                    )}
                  </td>
                  <td>{trip.note ? trip.note : "N/A"}</td>
                  <td>
                    {trip?.image_urls?.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={`https://isovia.ca/fms_api/${imgUrl}`}
                        alt="Trip Img"
                        onClick={() => {
                          setZoomImage(`https://isovia.ca/fms_api/${imgUrl}`);
                          setShowZoomModal(true);
                        }}
                        style={{
                          maxWidth: "60px",
                          height: "auto",
                          borderRadius: "4px",
                          marginRight: "5px",
                          cursor: "pointer",
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </td>
                  <td>
                    <img
                      src={`https://isovia.ca/fms_api/${trip.signature_url}`}
                      alt="Signature"
                      onClick={() => {
                        setZoomImage(`https://isovia.ca/fms_api/${trip.signature_url}`);
                        setShowZoomModal(true);
                      }}
                      style={{
                        maxWidth: "60px",
                        height: "auto",
                        borderRadius: "4px",
                        marginRight: "5px",
                        cursor: "pointer",
                        background: "white",
                        border: "1px solid #ccc",
                      }}
                    />
                  </td>
                  <td><Link to={`/dutychart/${trip.driver_id}`}>View Chart</Link></td>
                  <td>
                    {locations[trip.trip_id] || (
                      trip.latitude && trip.longitude 
                        ? "Loading address..." 
                        : "Location not available"
                    )}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleUpdateClick(trip)}
                      >
                        Update
                      </button>
                      <button
                        className={`btn btn-sm ${
                          trip.status === "on" ? "btn-danger" : "btn-success"
                        }`}
                        onClick={() => handleStatusChange(trip.trip_id, trip.status)}
                        disabled={updating}
                      >
                        {trip.status === "on" ? "Turn Off" : "Turn On"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {trips.length === 0 && !message && (
            <div className="alert alert-info">No trips found for this driver</div>
          )}
        </div>
      )}

      {showZoomModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowZoomModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body text-center">
                <img
                  src={zoomImage}
                  alt="Zoomed"
                  style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dutylist;