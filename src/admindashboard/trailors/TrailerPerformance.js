import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../config";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrailerPerformance = () => {
  const [filter, setFilter] = useState({
    trailer_id: "",
    start: "",
    end: "",
  });

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = `${BASE_URL}api`;
  const cookie = "ci_session=cq79u31gmd21agdi2omau8es8oik794n";

  // Fetch Performance API
  const fetchPerformance = async () => {
    if (!filter.trailer_id || !filter.start || !filter.end) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const url = `${baseURL}/trailerPerformance?trailer_id=${filter.trailer_id}&start=${filter.start}&end=${filter.end}`;

      const res = await axios.get(url, {
        headers: { Cookie: cookie },
        withCredentials: true,
      });

      if (res.data.status) {
        const records = res.data.records;

        // Find matching trailer record
        const selected = records.find(
          (t) => t.trailer_id === filter.trailer_id
        );

        if (selected) {
          setSummary(selected.summary);
          setChartData(selected.chart);
        } else {
          setSummary(null);
          setChartData([]);
        }
      } else {
        setSummary(null);
        setChartData([]);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Chart.js Data
  const getChart = () => {
    return {
      labels: chartData.map((d) => d.date),
      datasets: [
        {
          label: "Mileage",
          data: chartData.map((d) => parseInt(d.mileage)),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.3)",
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    };
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>

      {/* ⭐ Top Add Button */}
      <div className="d-flex justify-content-end mb-3 mt-3">
        <Link to="/addTrailerActivity" className="btn btn-success">
          + Add Trailer Activity
        </Link>
      </div>

      <h2 className="mb-4">Trailer Performance</h2>

      {/* Filters Section */}
      <div className="row g-3">
        <div className="col-md-4">
          <label>Trailer ID</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Trailer ID"
            value={filter.trailer_id}
            onChange={(e) =>
              setFilter({ ...filter, trailer_id: e.target.value })
            }
          />
        </div>

        <div className="col-md-4">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={filter.start}
            onChange={(e) => setFilter({ ...filter, start: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={filter.end}
            onChange={(e) => setFilter({ ...filter, end: e.target.value })}
          />
        </div>

        <div className="col-md-3 mt-3">
          <button
            className="btn btn-primary w-100"
            onClick={fetchPerformance}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Performance"}
          </button>
        </div>
      </div>

      {/* Predictive Maintenance Alerts */}
      {summary && (
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="box box-warning shadow-sm" style={{ borderTop: '3px solid #f39c12' }}>
              <div className="box-header with-border">
                <h4 className="box-title"><i className="fa fa-warning text-warning"></i> Predictive Maintenance Alerts</h4>
              </div>
              <div className="box-body">
                {parseInt(summary.total_mileage) > 0 ? (
                  <ul className="list-group">
                    {/* General Service Alert - Every 10,000 miles */}
                    {parseInt(summary.total_mileage) % 10000 > 9000 && (
                      <li className="list-group-item list-group-item-warning d-flex justify-content-between align-items-center">
                        <span><strong>General Service Due:</strong> Trailer is approaching its 10,000 mile service interval.</span>
                        <span className="badge bg-warning text-dark">Urgent</span>
                      </li>
                    )}
                    {/* Tire Inspection - Every 5,000 miles */}
                    {parseInt(summary.total_mileage) % 5000 > 4500 && (
                      <li className="list-group-item list-group-item-info d-flex justify-content-between align-items-center">
                        <span><strong>Tire & Brake Inspection:</strong> Periodic check recommended (every 5,000 miles).</span>
                        <span className="badge bg-info">Moderate</span>
                      </li>
                    )}
                    {/* HUB/Axle Greasing - Every 15,000 miles */}
                    {parseInt(summary.total_mileage) % 15000 > 14000 && (
                      <li className="list-group-item list-group-item-danger d-flex justify-content-between align-items-center">
                        <span><strong>Axle/Hub Greasing:</strong> Major service interval approaching (every 15,000 miles).</span>
                        <span className="badge bg-danger">Critical</span>
                      </li>
                    )}
                    {!(parseInt(summary.total_mileage) % 10000 > 9000) &&
                      !(parseInt(summary.total_mileage) % 5000 > 4500) &&
                      !(parseInt(summary.total_mileage) % 15000 > 14000) && (
                        <li className="list-group-item list-group-item-success">
                          <i className="fa fa-check-circle text-success"></i> All predictive systems normal. No immediate service required based on mileage.
                        </li>
                      )}
                  </ul>
                ) : (
                  <p className="text-muted">No maintenance alerts available. Odometer data required.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {summary && (
        <div className="row mt-4">
          <h4>Summary</h4>

          <div className="col-md-3">
            <div className="card p-3 text-center shadow-sm">
              <h5>Total Mileage</h5>
              <h3>{summary.total_mileage}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 text-center shadow-sm">
              <h5>Active Days</h5>
              <h3>{summary.active_days}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 text-center shadow-sm">
              <h5>Downtime Days</h5>
              <h3>{summary.downtime_days}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 text-center shadow-sm">
              <h5>Maintenance Days</h5>
              <h3>{summary.maintenance_days}</h3>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ Chart */}
      {chartData?.length > 0 && (
        <div className="mt-4" style={{ height: "260px" }}>
          <h5 className="mb-3">Mileage Chart</h5>
          <Line data={getChart()} />
        </div>
      )}

      {/* Table */}
      {chartData?.length > 0 && (
        <table className="table table-bordered mt-4">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Mileage</th>
            </tr>
          </thead>

          <tbody>
            {chartData?.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.status}</td>
                <td>{row.mileage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No Data */}
      {summary === null && chartData.length === 0 && (
        <p className="mt-4 text-danger">No data found for this trailer.</p>
      )}
    </div>
  );
};

export default TrailerPerformance;
