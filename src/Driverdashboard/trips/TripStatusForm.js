import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TripStatusForm() {
  const [formData, setFormData] = useState({
    tmsTripId: '',
    status: '',
    timeStamp: '',
    lat: '',
    lon: '',
    label: '',
  });

  // ✅ Auto-get location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }));
        },
        (error) => {
          console.error('Location error:', error);
          alert('Unable to fetch location automatically.');
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tmsTripId: formData.tmsTripId,
      status: parseInt(formData.status),
      timeStamp: formData.timeStamp,
      loc: {
        coords: {
          lat: formData.lat.toString(),
          lon: formData.lon.toString(),
        },
        label: formData.label,
      },
    };

    try {
      const response = await axios.post(
        'https://tripmanagement.trimblemaps.com/api/trip/tripStatus',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'D487078091664D428AA781953AE84DF1',
          },
        }
      );
      console.log('Status updated:', response.data);
      alert('Trip status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update trip status.');
    }
  };

  return (
    <div className="content-wrapper">
    <div className="container mt-5">
      <h3 className="mb-4">Update Trip Status</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Trip ID</label>
          <input
            type="text"
            name="tmsTripId"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="1">Start</option>
            <option value="2">Paused</option>
            <option value="3">Completed</option>
            {/* Add more status codes as needed */}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">TimeStamp</label>
          <input
            type="datetime-local"
            name="timeStamp"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Location Label</label>
          <input
            type="text"
            name="label"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Latitude</label>
            <input
              type="text"
              name="lat"
              className="form-control"
              value={formData.lat}
              readOnly
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Longitude</label>
            <input
              type="text"
              name="lon"
              className="form-control"
              value={formData.lon}
              readOnly
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Status
        </button>
      </form>
    </div>
    </div>
  );
}

export default TripStatusForm;
