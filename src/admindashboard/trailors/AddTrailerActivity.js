import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from "../../config";

const AddTrailerActivity = () => {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    trailer_id: "",
    driver_id: "",
    date: "",
    mileage: "",
    status: "active",
  });

  const baseURL = `${BASE_URL}api`;
  const cookie = "ci_session=cq79u31gmd21agdi2omau8es8oik794n"; // replace if needed

  // ---------------------------
  // Fetch Driver List
  // ---------------------------
  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${baseURL}/fetchdriversProductData`, {
        headers: { Cookie: cookie },
        withCredentials: true,
      });

      setDrivers(res.data || []);
    } catch (err) {
      console.error("Driver Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // ---------------------------
  // Handle Input Change
  // ---------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------
  // Submit Trailer Activity
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.trailer_id || !form.driver_id || !form.date || !form.mileage) {
      alert("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("trailer_id", form.trailer_id);
    data.append("driver_id", form.driver_id);
    data.append("date", form.date);
    data.append("mileage", form.mileage);
    data.append("status", form.status);

    try {
      const res = await axios.post(`${baseURL}/addTrailerActivity`, data, {
        headers: { Cookie: cookie },
        withCredentials: true,
      });

      if (res.data.status) {
        alert("Trailer Activity Added Successfully!");
        setForm({
          trailer_id: "",
          driver_id: "",
          date: "",
          mileage: "",
          status: "active",
        });
      } else {
        alert(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to submit trailer activity");
    }
  };

  // ---------------------------
  // UI Section
  // ---------------------------
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2 className="mb-4">Add Trailer Activity</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* Trailer ID */}
          <div className="col-md-4">
            <label className="form-label">Trailer ID</label>
            <input
              type="number"
              className="form-control"
              name="trailer_id"
              value={form.trailer_id}
              onChange={handleChange}
              placeholder="Enter Trailer ID"
              required
            />
          </div>

          {/* Driver List */}
          <div className="col-md-4">
            <label className="form-label">Driver</label>
            <select
              className="form-select"
              name="driver_id"
              value={form.driver_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fname} {d.lname} (ID: {d.id})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mileage */}
          <div className="col-md-4">
            <label className="form-label">Mileage</label>
            <input
              type="number"
              className="form-control"
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
              placeholder="Enter Mileage"
              required
            />
          </div>

          {/* Status */}
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-md-4 d-flex align-items-end">
            <button className="btn btn-primary w-100">Add Trailer Activity</button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddTrailerActivity;
