import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";

const CheckHos = () => {
  const [drivers, setDrivers] = useState([]);

  const [formData, setFormData] = useState({
    driverId: "",
    timestamp: "",
    lat: "",
    lon: "",
    cycle: "canada_70hr_7day",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const cookie = "ci_session=cq79u31gmd21agdi2omau8es8oik794n";

  // -----------------------------
  // Fetch Driver List
  // -----------------------------
  const fetchDrivers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}api/fetchdriversProductData`,
        {
          headers: { Cookie: cookie },
          withCredentials: true,
        }
      );

      setDrivers(res.data || []);
    } catch (err) {
      console.error("Driver Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // -----------------------------
  // Check HOS API Handler
  // -----------------------------
  const checkHos = async () => {
    if (!formData.driverId || !formData.timestamp || !formData.lat || !formData.lon) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        driverId: formData.driverId,
        timestamp: formData.timestamp,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        cycle: formData.cycle,
      };

      const res = await axios.post(
        `${BASE_URL}hos/check`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error("HOS Check Error:", err);
      setResult(null);
    }

    setLoading(false);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2 className="mb-4">Check HOS Status</h2>

      <div className="row g-3">

        {/* Driver Dropdown */}
        <div className="col-md-4">
          <label>Driver</label>
          <select
            className="form-select"
            value={formData.driverId}
            onChange={(e) =>
              setFormData({ ...formData, driverId: e.target.value })
            }
            required
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fname} {driver.lname}
              </option>
            ))}
          </select>
        </div>

        {/* Timestamp */}
        <div className="col-md-4">
          <label>Timestamp</label>
          <input
            type="datetime-local"
            className="form-control"
            value={formData.timestamp}
            onChange={(e) =>
              setFormData({ ...formData, timestamp: e.target.value })
            }
            required
          />
        </div>

        {/* Latitude */}
        <div className="col-md-2">
          <label>Latitude</label>
          <input
            type="number"
            className="form-control"
            placeholder="43.6532"
            value={formData.lat}
            onChange={(e) =>
              setFormData({ ...formData, lat: e.target.value })
            }
            required
          />
        </div>

        {/* Longitude */}
        <div className="col-md-2">
          <label>Longitude</label>
          <input
            type="number"
            className="form-control"
            placeholder="-79.3832"
            value={formData.lon}
            onChange={(e) =>
              setFormData({ ...formData, lon: e.target.value })
            }
            required
          />
        </div>

        {/* Cycle */}
        <div className="col-md-4">
          <label>Cycle</label>
          <select
            className="form-select"
            value={formData.cycle}
            onChange={(e) =>
              setFormData({ ...formData, cycle: e.target.value })
            }
          >
            <option value="canada_70hr_7day">Canada 70 hr / 7 day</option>
            <option value="usa_70hr_8day">USA 70 hr / 8 day</option>
            <option value="usa_60hr_7day">USA 60 hr / 7 day</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={checkHos}
            disabled={loading}
          >
            {loading ? "Checking..." : "Check HOS"}
          </button>
        </div>
      </div>

      {/* -------------------- RESULT UI -------------------- */}
      {result && (
        <div className="mt-4">

          {/* Driver Info */}
          <div className="card p-3 mb-3 shadow-sm">
            <h4>Driver Information</h4>
            <p><strong>Name:</strong> {result.driver?.name}</p>
            <p><strong>Driver ID:</strong> {result.driver?.id}</p>
            <p><strong>Company:</strong> {result.driver?.company}</p>
            <p><strong>Fleet:</strong> {result.driver?.fleet}</p>
          </div>

          {/* Jurisdiction + Cycle */}
          <div className="card p-3 mb-3 shadow-sm">
            <h4>HOS Details</h4>
            <p><strong>Jurisdiction:</strong> {result.jurisdiction}</p>
            <p><strong>Cycle:</strong> {result.cycle}</p>
            <p><strong>Checked At:</strong> {result.result?.checkedAt}</p>
          </div>

          {/* Summary */}
          <div className="card p-3 mb-3 shadow-sm">
            <h4>Summary</h4>
            <div className="row">
              <div className="col-md-3">
                <strong>Driving Minutes</strong>
                <div>{result.result?.summary?.drivingMinutes}</div>
              </div>

              <div className="col-md-3">
                <strong>On Duty Minutes</strong>
                <div>{result.result?.summary?.onDutyMinutes}</div>
              </div>

              <div className="col-md-3">
                <strong>Off Duty Minutes</strong>
                <div>{result.result?.summary?.offDutyMinutes}</div>
              </div>

              <div className="col-md-3">
                <strong>Sleeper Berth Minutes</strong>
                <div>{result.result?.summary?.sleeperBerthMinutes}</div>
              </div>
            </div>

            <p className="mt-2">
              <strong>Period Start:</strong> {result.result?.summary?.periodStart}
            </p>
          </div>

          {/* Violations */}
          <div className="card p-3 shadow-sm">
            <h4>Violations</h4>

            {result.result?.violations?.length === 0 ? (
              <p className="text-success"><strong>No Violations 🎉</strong></p>
            ) : (
              <ul>
                {result.result.violations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckHos;
