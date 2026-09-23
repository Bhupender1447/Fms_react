import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const TruckExpiryAlerts = () => {
  const [truckList, setTruckList] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ✅ Fetch truck list */
  useEffect(() => {
    axios
      .get(`${BASE_URL}api/getTrucks`)
      .then(res => {
        if (res.data.status === "success") {
          setTruckList(res.data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  /* ✅ Fetch expiry alerts */
  useEffect(() => {
    if (!selectedTruck) return;

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${BASE_URL}api/check_expiry/${selectedTruck}`
        );

        if (res.data.success) {
          setAlerts(res.data.alerts || []);
          setTotalAlerts(res.data.total_alerts || 0);
        } else {
          setError("Failed to load expiry alerts");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [selectedTruck]);

  const getStatusLabel = (status) => {
    if (status === "expired") return "label label-danger";
    if (status === "locked") return "label label-default";
    return "label label-warning";
  };

  const formatFieldName = (field) => {
    if (!field) return "-";
    return field
      .replace(/_/g, " ")
      .replace("expiry", "")
      .toUpperCase();
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>
          Truck Document Expiry <small>Alerts</small>
        </h1>
      </section>

      <section className="content">
        <div className="box box-danger">

          {/* ✅ Header */}
          <div className="box-header with-border">
            <label>Select Truck</label>
            <select
              className="form-control"
              style={{ maxWidth: 350 }}
              value={selectedTruck}
              onChange={(e) => setSelectedTruck(e.target.value)}
            >
              <option value="">-- Select Truck --</option>
              {truckList.map(truck => (
                <option key={truck.id} value={truck.id}>
                  {truck.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Body */}
          <div className="box-body">

            {loading && (
              <div className="text-center">
                <div className="spinner-border" />
                <p>Loading alerts...</p>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && alerts.length > 0 && (
              <>
                <p>
                  <strong>Total Alerts:</strong> {totalAlerts}
                </p>

                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Truck ID</th>
                      <th>Plate</th>
                      <th>Document</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((a, i) => (
                      <tr
                        key={i}
                        className={a.status === "locked" ? "active" : ""}
                      >
                        <td>{i + 1}</td>
                        <td>{a.truck_id}</td>
                        <td>{a.plate}</td>

                        <td>
                          {a.field ? formatFieldName(a.field) : "SYSTEM"}
                        </td>

                        <td>{a.expiry_date || "-"}</td>

                        <td>
                          <span className={getStatusLabel(a.status)}>
                            {a.status.toUpperCase()}
                          </span>
                        </td>

                        <td style={{ maxWidth: 400 }}>
                          {a.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {!loading && selectedTruck && alerts.length === 0 && (
              <div className="alert alert-info">
                No expiry alerts found for this truck
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default TruckExpiryAlerts;
