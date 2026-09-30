import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';

const HoursOfServiceForm = () => {
  const [formData, setFormData] = useState({
    RouteId: "",
    UseTollData: true,
    EstimatedTimeOptions: {
      ETAETD: 1,
    },
    UseTraffic: true,
    Stops: [{
      Address: {
        StreetAddress: "",
        City: "",
        State: "",
        Zip: "",
      },
      Label: "",
      Costs: {
        CostOfStop: 0,
        HoursPerStop: 0.5,
      }
    }],
    TruckCfg: {
      Height: "13'6\"",
      Length: "53'",
      Width: "96\"",
      Weight: "80000",
      Axles: 5,
    },
    HoSOptions: {
      Enabled: true,
      RemainingDriveTime: 39600,
      RemainingOnDutyTime: 50400,
      CurrentOffDutyTime: 32400,
    }
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.RouteId) newErrors.RouteId = "Required";
    formData.Stops.forEach((stop, index) => {
      if (!stop.Label) newErrors[`label-${index}`] = "Location Label Required";
      if (!stop.Address.StreetAddress) newErrors[`streetAddress-${index}`] = "Street Address Required";
      if (!stop.Address.City) newErrors[`city-${index}`] = "City Required";
      if (!stop.Address.State) newErrors[`state-${index}`] = "State Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Changed to our custom backend endpoint to generate HOS reports
      const response = await axios.post(
        `${BASE_URL}api/maps/route/hos-report`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      setApiResponse(response.data);
    } catch (error) {
      console.error('API Error:', error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...formData.Stops];
    updatedStops[index] = {
      ...updatedStops[index],
      [field]: typeof value === 'object' ? {
        ...updatedStops[index][field],
        ...value
      } : value
    };

    setFormData({
      ...formData,
      Stops: updatedStops
    });
  };

  const addNewStop = () => {
    setFormData({
      ...formData,
      Stops: [...formData.Stops, {
        Address: {
          StreetAddress: "",
          City: "",
          State: "",
          Zip: "",
        },
        Label: "",
        Costs: {
          CostOfStop: 0,
          HoursPerStop: 0.5,
        }
      }]
    });
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="content-wrapper">
      <div className="container mt-4">
        <h2 className="mb-4">Route Planning & HOS Form</h2>

        <form onSubmit={handleSubmit}>
          {/* Route ID */}
          <div className="mb-3">
            <label className="form-label">Route ID *</label>
            <input
              type="text"
              className={`form-control ${errors.RouteId ? 'is-invalid' : ''}`}
              value={formData.RouteId}
              onChange={(e) => setFormData({
                ...formData,
                RouteId: e.target.value
              })}
            />
            {errors.RouteId && <div className="invalid-feedback">{errors.RouteId}</div>}
          </div>

          {/* Stops */}
          {formData.Stops.map((stop, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header">Stop {index + 1}</div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Location Label *</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`label-${index}`] ? 'is-invalid' : ''}`}
                      value={stop.Label}
                      onChange={(e) => handleStopChange(index, 'Label', e.target.value)}
                    />
                    {errors[`label-${index}`] &&
                      <div className="invalid-feedback">{errors[`label-${index}`]}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`streetAddress-${index}`] ? 'is-invalid' : ''}`}
                      value={stop.Address.StreetAddress}
                      onChange={(e) => handleStopChange(index, 'Address', {
                        ...stop.Address,
                        StreetAddress: e.target.value
                      })}
                    />
                    {errors[`streetAddress-${index}`] &&
                      <div className="invalid-feedback">{errors[`streetAddress-${index}`]}</div>}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`city-${index}`] ? 'is-invalid' : ''}`}
                      value={stop.Address.City}
                      onChange={(e) => handleStopChange(index, 'Address', {
                        ...stop.Address,
                        City: e.target.value
                      })}
                    />
                    {errors[`city-${index}`] &&
                      <div className="invalid-feedback">{errors[`city-${index}`]}</div>}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`state-${index}`] ? 'is-invalid' : ''}`}
                      value={stop.Address.State}
                      onChange={(e) => handleStopChange(index, 'Address', {
                        ...stop.Address,
                        State: e.target.value
                      })}
                    />
                    {errors[`state-${index}`] &&
                      <div className="invalid-feedback">{errors[`state-${index}`]}</div>}
                  </div>

                  <div className="col-md-2">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={stop.Address.Zip}
                      onChange={(e) => handleStopChange(index, 'Address', {
                        ...stop.Address,
                        Zip: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addNewStop}
            >
              + Add Stop
            </button>
          </div>

          {/* Truck Configuration */}
          <div className="card mb-4">
            <div className="card-header">Truck Configuration</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Height</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.TruckCfg.Height}
                    onChange={(e) => setFormData({
                      ...formData,
                      TruckCfg: {
                        ...formData.TruckCfg,
                        Height: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Length</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.TruckCfg.Length}
                    onChange={(e) => setFormData({
                      ...formData,
                      TruckCfg: {
                        ...formData.TruckCfg,
                        Length: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Width</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.TruckCfg.Width}
                    onChange={(e) => setFormData({
                      ...formData,
                      TruckCfg: {
                        ...formData.TruckCfg,
                        Width: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Weight</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.TruckCfg.Weight}
                    onChange={(e) => setFormData({
                      ...formData,
                      TruckCfg: {
                        ...formData.TruckCfg,
                        Weight: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : 'Submit'}
          </button>
        </form>

        {/* API Response Display */}
        {apiResponse && (
          <div className="mt-5">
            <h3 className="mb-4">Route Report: {apiResponse.RouteID || formData.RouteId}</h3>

            <div className="card mb-4">
              <div className="card-header">Driver Hours Summary</div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <p>Remaining Drive Time: {formatTime(apiResponse.DriverHoursOfServiceRemaining?.RemainingDriveTime)}</p>
                    <p>Remaining On Duty: {formatTime(apiResponse.DriverHoursOfServiceRemaining?.RemainingOnDutyTime)}</p>
                  </div>
                  <div className="col-md-4">
                    <p>Total Driving: {apiResponse.TotalDrivingDuration ? (apiResponse.TotalDrivingDuration).toFixed(2) : '-'} hours</p>
                    <p>Total Duration: {apiResponse.TotalDuration ? (apiResponse.TotalDuration).toFixed(2) : '-'} hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">Stops Details</div>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Location</th>
                      <th>Address</th>
                      <th>Arrival Time</th>
                      <th>Departure Time</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(apiResponse.Stops || []).map((stop, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{stop.Label}</td>
                        <td>
                          {stop.Address?.StreetAddress},<br />
                          {stop.Address?.City}, {stop.Address?.State} {stop.Address?.Zip}
                        </td>
                        <td>{stop.EstimatedTimeOfArrival || '-'}</td>
                        <td>{stop.EstimatedTimeOfDeparture || '-'}</td>
                        <td>{stop.StopDuration} hours</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoursOfServiceForm;