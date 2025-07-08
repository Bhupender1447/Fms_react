import React, { useEffect, useState } from 'react';

export default function DriverDutyStatus() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [driverLocations, setDriverLocations] = useState({});

  // Function to get address from coordinates
  const getAddressFromLatLng = async (lat, lng, driverId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBM3VgKsX8mEGsVYpSic7VLNKwEmZ7IABc`
      );
      const data = await response.json();
      
      if (data.results.length > 0) {
        setDriverLocations(prev => ({
          ...prev,
          [driverId]: data.results[0].formatted_address
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding error", error);
      setDriverLocations(prev => ({
        ...prev,
        [driverId]: "Location not available"
      }));
    }
  };

  // Fetch API
  const fetchDrivers = async () => {
    try {
      const response = await fetch('https://isovia.ca/fms_api/api/getDriversDutyStatus');
      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        setDrivers(data.drivers || []);

        // Fetch locations for each driver
        data.drivers.forEach(driver => {
          if (driver.latitude && driver.longitude) {
            getAddressFromLatLng(driver.latitude, driver.longitude, driver.driver_id);
          }
        });

        if (data.count_on_duty > 0) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  // Fetch immediately and every 30 minutes
  useEffect(() => {
    fetchDrivers();
    const intervalId = setInterval(fetchDrivers, 1800000); // 30 minutes

    return () => clearInterval(intervalId);
  }, []);

  // Show Bootstrap modal when showModal is true
  useEffect(() => {
    const modalEl = document.getElementById('dutyModal');
    if (!modalEl) return;

    if (showModal) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  }, [showModal]);

  return (
    <div className='content-wrapper p-4'>
      <h2 className="mb-4">Drivers On Duty</h2>

      {/* Bootstrap Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Driver ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Login Time</th>
            <th>Elapsed Time</th>
            <th>Time Remaining</th>
            <th>Status</th>
            <th>Location</th>
            <th>Uploaded Images</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          {drivers.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">No drivers on duty</td>
            </tr>
          ) : (
            drivers.map((driver) => (
              <tr key={driver.driver_id}>
                <td>{driver.driver_id}</td>
                <td>{driver.fname}</td>
                <td>{driver.lname}</td>
                <td>{driver.login_time}</td>
                <td>{driver.elapsed_time}</td>
                <td>{driver.time_remaining}</td>
                <td>{driver.status}</td>
                <td>
                  {driverLocations[driver.driver_id] || 
                   (driver.latitude && driver.longitude ? 
                    "Loading location..." : 
                    "Location not available")}
                </td>
                <td>
                  {driver?.image_urls?.map((imgUrl, index) => (
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
                    src={`https://isovia.ca/fms_api/${driver.signature_url}`}
                    alt="Signature"
                    onClick={() => {
                      setZoomImage(`https://isovia.ca/fms_api/${driver.signature_url}`);
                      setShowZoomModal(true);
                    }}
                    style={{
                      maxWidth: "60px",
                      height: "auto",
                      borderRadius: "4px",
                      marginRight: "5px",
                      cursor: "pointer",
                      background:"white",
                      border: "1px solid #ccc",
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="dutyModal"
        tabIndex="-1"
        aria-labelledby="dutyModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="dutyModalLabel">Drivers On Duty Notification</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              {drivers.map((driver) => (
                <div key={driver.driver_id} className="mb-3 border-bottom pb-2">
                  <p><strong>Name:</strong> {driver.fname} {driver.lname}</p>
                  <p><strong>Elapsed Time:</strong> {driver.elapsed_time}</p>
                  <p><strong>Time Remaining:</strong> {driver.time_remaining}</p>
                  <p><strong>Status:</strong> {driver.status}</p>
                  <p><strong>Location:</strong> {driverLocations[driver.driver_id] || 
                     (driver.latitude && driver.longitude ? 
                      "Loading location..." : 
                      "Location not available")}</p>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

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
}