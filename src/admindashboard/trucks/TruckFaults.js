import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from "../../config";

const TruckFaults = () => {
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaults();
  }, []);

  const fetchFaults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}api/get_truck_faults`,
        { withCredentials: true }
      );

      setFaults(res.data.faults || []);
    } catch (err) {
      console.error("Fault API Error", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const map = {
      low: "label label-success",
      medium: "label label-warning",
      high: "label label-danger",
    };
    return (
      <span className={map[severity] || "label label-default"}>
        {severity}
      </span>
    );
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Truck Faults
          <small> All Vehicles Diagnostics</small>
        </h1>
      </section>

      <section className="content">
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title">Fault List</h3>
          </div>

          <div className="box-body table-responsive">
            {loading ? (
              <p>Loading faults...</p>
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Truck ID</th>
                    <th>Fault Code</th>
                    <th>Description</th>
                    <th>Severity</th>
                    <th>Occurred At</th>
                  </tr>
                </thead>
                <tbody>
                  {faults.length === 0 ? (
                    <tr>
                      <td colSpan="6" align="center">
                        No Faults Found
                      </td>
                    </tr>
                  ) : (
                    faults.map((f) => (
                      <tr key={f.id}>
                        <td>{f.id}</td>
                        <td>{f.truck_id}</td>
                        <td>
                          <strong>{f.fault_code}</strong>
                        </td>
                        <td>{f.fault_description}</td>
                        <td>{getSeverityBadge(f.severity)}</td>
                        <td>{f.occurred_at}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="box-footer">
            <small className="text-muted">
              Total Faults: {faults.length}
            </small>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TruckFaults;
