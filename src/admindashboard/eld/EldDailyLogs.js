import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const EldDashboard = () => {
  const [driverId, setDriverId] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const cookie = "ci_session=i7uiaoea50db00kpf1lh8g2uo8ridcqh";

  // Fetch drivers list
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
    } catch (error) {
      console.error("Driver Fetch Error:", error);
    }
  };

  // Fetch Daily Logs API
  const fetchLogs = async () => {


    const url = `${BASE_URL}api/hos_daily_logs?startDate=${filter.startDate}&endDate=${filter.endDate}&driverIds=${driverId}`;

    try {
      const res = await axios.get(url, {
        headers: { Cookie: cookie },
        withCredentials: true,
      });

      setLogs(res.data.data || []);
    } catch (error) {
      console.error("Fetch Logs Error:", error);
    }
  };

  // Graph data
  const getChartData = () => {
    const labels = logs.map((l) =>
      new Date(l.startTime).toLocaleDateString()
    );

    const driveHours = logs.map((l) =>
      (l.dutyStatusDurations.driveDurationMs / 3600000).toFixed(2)
    );

    const activeHours = logs.map((l) =>
      (l.dutyStatusDurations.activeDurationMs / 3600000).toFixed(2)
    );

    const offDutyHours = logs.map((l) =>
      (l.dutyStatusDurations.offDutyDurationMs / 3600000).toFixed(2)
    );

    return {
      labels,
      datasets: [
        {
          label: "Driving Hours",
          data: driveHours,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          label: "Active Hours",
          data: activeHours,
          backgroundColor: "rgba(255, 159, 64, 0.7)",
        },
        {
          label: "Off Duty Hours",
          data: offDutyHours,
          backgroundColor: "rgba(75, 192, 192, 0.7)",
        },
      ],
    };
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="content-wrapper p-3" style={{ minHeight: 600 }}>
      <h2 className="mb-4">ELD Daily Logs Dashboard</h2>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <select
            className="form-control"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fname} {d.lname} (ID: {d.id})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
          />
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={filter.endDate}
            onChange={(e) =>
              setFilter({ ...filter, endDate: e.target.value })
            }
          />
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchLogs}>
            Fetch Logs
          </button>
        </div>
      </div>

      {/* Graph */}
      {logs.length > 0 && (
        <div className="mb-4 p-3 bg-white rounded shadow">
          <h4 className="mb-3">Duty Hours Summary</h4>
          <div style={{ height: "320px" }}>
            <Bar data={getChartData()} />
          </div>
        </div>
      )}

      {/* Daily Log Cards */}
      {logs.map((log, index) => {
        const d = log.dutyStatusDurations;
        const meta = log.logMetaData;

        return (
          <div key={index} className="card mb-4 shadow">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                {new Date(log.startTime).toLocaleDateString()} — Daily Log
              </h5>
            </div>

            <div className="card-body">
              {/* Row 1 – Driver & Carrier */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Driver:</strong> {log.driver.name} (ID:{" "}
                  {log.driver.id})
                  <br />
                  <strong>Timezone:</strong> {log.driver.timezone}
                </div>

                <div className="col-md-6">
                  <strong>Carrier:</strong> {meta.carrierName}
                  <br />
                  <strong>Address:</strong> {meta.carrierFormattedAddress}
                </div>
              </div>

              {/* Row 2 – Vehicle & Trailer */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Vehicle:</strong>{" "}
                  {meta.vehicles?.[0]?.name || "N/A"}
                  <br />
                  <strong>VIN:</strong>{" "}
                  {meta.vehicles?.[0]?.externalIds?.["samsara.vin"] || "N/A"}
                </div>

                <div className="col-md-4">
                  <strong>Trailer:</strong>{" "}
                  {meta.trailerNames?.join(", ") || "N/A"}
                </div>

                <div className="col-md-4">
                  <strong>CERTIFIED:</strong>{" "}
                  {meta.isCertified ? (
                    <span className="text-success">Yes</span>
                  ) : (
                    <span className="text-danger">No</span>
                  )}
                </div>
              </div>

              {/* Row 3 – Duty Status */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <strong>Driving:</strong>{" "}
                  {(d.driveDurationMs / 3600000).toFixed(2)} hrs
                </div>

                <div className="col-md-3">
                  <strong>On Duty:</strong>{" "}
                  {(d.onDutyDurationMs / 3600000).toFixed(2)} hrs
                </div>

                <div className="col-md-3">
                  <strong>Off Duty:</strong>{" "}
                  {(d.offDutyDurationMs / 3600000).toFixed(2)} hrs
                </div>

                <div className="col-md-3">
                  <strong>Sleeper Berth:</strong>{" "}
                  {(d.sleeperBerthDurationMs / 3600000).toFixed(2)} hrs
                </div>
              </div>

              {/* Row 4 – Distance */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Total Distance:</strong>{" "}
                  {(log.distanceTraveled.driveDistanceMeters / 1000).toFixed(
                    2
                  )}{" "}
                  km
                </div>
              </div>

              {/* Row 5 – Rule Sets */}
              <div>
                <strong>Rule Sets:</strong>
                <ul className="mt-2">
                  {log.driver.eldSettings.rulesets.map((r, i) => (
                    <li key={i}>
                      {r.cycle} — {r.jurisdiction} ({r.shift}) | Restart:{" "}
                      {r.restart}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EldDashboard;
