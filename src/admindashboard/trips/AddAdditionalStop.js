import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../config";

const AddAdditionalStop = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();

  /* ================= STATE ================= */

  const [formData, setFormData] = useState({
    tripid: tripId || "",
    stoptype: "Break",

    location: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "Canada",

    lat: "",
    lng: "",
  });

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
      ...formData,
      lat: String(formData.lat),
      lng: String(formData.lng),
    };

    try {
      await axios.post(
        `${BASE_URL}api/addAdditionalStop`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 🔥 cookie session
        }
      );

      toast.success("Additional stop added successfully");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add stop");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>
          Add Additional Stop <small>Trip</small>
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
                  value={formData.tripid}
                  disabled
                />
              </div>

              {/* Stop Type */}
              <div className="form-group">
                <label>Stop Type</label>
                <select
                  className="form-control"
                  name="stoptype"
                  value={formData.stoptype}
                  onChange={handleChange}
                  required
                >
                  <option value="Break">Break</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>

              {/* Location */}
              <div className="form-group">
                <label>Full Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="5055 Satellite Dr, Mississauga, ON"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label>Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <br />

              <div className="row">
                <div className="col-md-3">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label>ZIP</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label>Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <br />

              <div className="row">
                <div className="col-md-6">
                  <label>Latitude</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Longitude</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>

            <div className="box-footer">
              <button type="submit" className="btn btn-primary">
                Add Stop
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

export default AddAdditionalStop;
