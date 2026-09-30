import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';

function TripRecalculateForm() {
  const [formData, setFormData] = useState({
    tmsTripId: '',
    lat: '',
    lon: '',
    currentTime: '',
    stopAddress: '',
    stopCity: '',
    stopState: '',
    stopZip: '',
    stopLabel: '',
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
          console.error('Error fetching location:', error);
          alert('Unable to fetch current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
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
      currentLocation: {
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
      },
      currentTime: formData.currentTime,
      stop: {
        address: formData.stopAddress,
        city: formData.stopCity,
        state: formData.stopState,
        zip: formData.stopZip,
        label: formData.stopLabel
      }
    };

    try {
      // Changed to our custom backend endpoint that will handle PTV logistics recalculation
      const response = await axios.post(
        `${BASE_URL}api/maps/trip/recalculate`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      console.log('Success:', response.data);
      alert('Trip recalculated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to recalculate trip.');
    }
  };

  return (
    <div className="content-wrapper">
      <div className="container mt-5">
        <h2 className="mb-4">Trip Recalculate</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Trip ID</label>
            <input type="text" name="tmsTripId" className="form-control" onChange={handleChange} required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Latitude</label>
              <input
                type="text"
                name="lat"
                className="form-control"
                value={formData.lat}
                onChange={handleChange}
                required
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
                onChange={handleChange}
                required
                readOnly
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Current Time (ISO format)</label>
            <input type="datetime-local" name="currentTime" className="form-control" onChange={handleChange} required />
          </div>
          <h5 className="mt-4">Stop Details</h5>
          <div className="mb-3">
            <label className="form-label">Street Address</label>
            <input type="text" name="stopAddress" className="form-control" onChange={handleChange} required />
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">City</label>
              <input type="text" name="stopCity" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">State</label>
              <input type="text" name="stopState" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Zip</label>
              <input type="text" name="stopZip" className="form-control" onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Stop Label</label>
            <input type="text" name="stopLabel" className="form-control" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Recalculate Trip</button>
        </form>
      </div>
    </div>
  );
}

export default TripRecalculateForm;
