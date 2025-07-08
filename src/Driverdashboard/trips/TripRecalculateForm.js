import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        coords: {
          lat: parseFloat(formData.lat),
          lon: parseFloat(formData.lon),
        },
      },
      currentTime: formData.currentTime,
      stops: [
        {
          Location: {
            Address: {
              StreetAddress: formData.stopAddress,
              City: formData.stopCity,
              State: formData.stopState,
              Zip: formData.stopZip,
            },
            Label: formData.stopLabel,
          },
          earliestArrivalTime: formData.currentTime,
          latestArrivalTime: formData.currentTime,
          stopType: 'Work',
          stopSequence: 1,
          plannedDuration: 120,
        },
      ],
      driverHoursOfService: {
        enabled: true,
        HoSRuleType: 4,
        RemainingDriveTime: 18000,
        RemainingOnDutyTime: 28800,
        CurrentOffDutyTime: 18000,
        POIStopsReturned: true,
        CustomBreakDurations: {
          ShortBreakDuration: 1800,
          EndOfDutyBreakDuration: 36000,
        },
        teamDriving: true,
        activeDriver: 2,
        HOSWindowStart: 60,
        HOSWindowEnd: 10,
      },
    };

    try {
      const response = await axios.put(
        'https://tripmanagement.trimblemaps.com/api/trip/recalculate',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'D487078091664D428AA781953AE84DF1',
          },
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
