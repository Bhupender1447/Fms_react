import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../config";

const SplitTripCityHighway = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();

  /* ================= STATES ================= */

  const [drivers, setDrivers] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

  const [formData, setFormData] = useState({
    tmsTriptId: tripId || "",

    city_distance: "",
    city_driver_id: "",
    city_rate: "",

    highway_distance: "",
    highway_driver_id: "",
    highway_rate: "",
  });

  /* ================= FETCH DRIVERS ================= */

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}api/getDrivers`,
        { withCredentials: true }
      );
      setDrivers(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load drivers");
    }
  };

  /* ================= AUTO DISTANCE ================= */

  useEffect(() => {
    const city = Number(formData.city_distance) || 0;
    const highway = Number(formData.highway_distance) || 0;
    setTotalDistance(city + highway);
  }, [formData.city_distance, formData.highway_distance]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      tmsTriptId: formData.tmsTriptId,
      city: {
        distance: Number(formData.city_distance),
        driver_id: Number(formData.city_driver_id),
        rate: Number(formData.city_rate),
      },
      highway: {
        distance: Number(formData.highway_distance),
        driver_id: Number(formData.highway_driver_id),
        rate: Number(formData.highway_rate),
      },
    };

    try {
      await axios.post(
        `${BASE_URL}api/splitTripCityHighway`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Trip split successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Trip split failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>
          Split Trip <small>City / Highway</small>
        </h1>
      </section>

      <section className="content">
        <div className="box box-primary">
          <form onSubmit={handleSubmit}>
            <div className="box-body">

              {/* Trip ID */}
              <div className="form-group">
                <label>Trip ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tmsTriptId}
                  disabled
                />
              </div>

              <hr />
              <h4>City Trip</h4>

              <div className="row">
                <div className="col-md-4">
                  <label>Distance</label>
                  <input
                    type="number"
                    className="form-control"
                    name="city_distance"
                    value={formData.city_distance}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label>Driver</label>
                  <select
                    className="form-control"
                    name="city_driver_id"
                    value={formData.city_driver_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fname} {d.lname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label>Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    name="city_rate"
                    value={formData.city_rate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <hr />
              <h4>Highway Trip</h4>

              <div className="row">
                <div className="col-md-4">
                  <label>Distance</label>
                  <input
                    type="number"
                    className="form-control"
                    name="highway_distance"
                    value={formData.highway_distance}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label>Driver</label>
                  <select
                    className="form-control"
                    name="highway_driver_id"
                    value={formData.highway_driver_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fname} {d.lname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label>Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    name="highway_rate"
                    value={formData.highway_rate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <br />
              <div className="alert alert-info">
                <strong>Total Distance:</strong> {totalDistance} KM
              </div>

            </div>

            <div className="box-footer">
              <button type="submit" className="btn btn-primary">
                Split Trip
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SplitTripCityHighway;
