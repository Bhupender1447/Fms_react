import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VehicleDriverLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    driverName: "",
    driverId: ""
  });

  useEffect(() => {
    axios.get("https://isovia.ca/fms_api/api/getVehicleDriverLogs")
      .then(res => {
        const data = res.data.data.map(item => ({
          ...item,
          log: JSON.parse(item.data_json).log
        }));
        setLogs(data);
        setFilteredLogs(data);
      })
      .catch(err => console.error("API error:", err));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = logs.filter(log => {
      const fullName = `${log.log.driver_first_name} ${log.log.driver_last_name}`.toLowerCase();
      return (
        (!newFilters.date || log.log.date === newFilters.date) &&
        (!newFilters.driverId || String(log.log.driver.id).includes(newFilters.driverId)) &&
        (!newFilters.driverName || fullName.includes(newFilters.driverName.toLowerCase()))
      );
    });
    setFilteredLogs(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Vehicle Driver Logs</h2>

      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="date"
            name="date"
            className="form-control"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            className="form-control"
            value={filters.driverName}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="driverId"
            placeholder="Driver ID"
            className="form-control"
            value={filters.driverId}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Log ID</th>
              <th>Date</th>
              <th>Driver Name</th>
              <th>Driver ID</th>
              <th>Driving Duration</th>
              <th>HOS Violations</th>
              <th>Events</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.log.id}</td>
                <td>{log.log.date}</td>
                <td>{log.log.driver_first_name} {log.log.driver_last_name}</td>
                <td>{log.log.driver.id}</td>
                <td>{log.log.driving_duration} sec</td>
                <td>
                  <ul>
                    {log.log.hos_violations.map((v, i) => (
                      <li key={i}>{v.hos_violation.name}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {log.log.events.map((e, i) => (
                      <li key={i}>{e.event.type} @ {e.event.location}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  {log.log.driver_signature_url ? (
                    <img src={log.log.driver_signature_url} alt="Signature" width="100" />
                  ) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
