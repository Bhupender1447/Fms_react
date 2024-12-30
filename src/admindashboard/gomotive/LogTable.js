import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [driverId, setDriverId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch Users on Mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/get_users');
        setUsers(response.data.users || []);
      } catch (err) {
        setError(err.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch Log Data
  const fetchLogData = async (id, start, end) => {
    setLoading(true);
    setError(null);
    setLogs([]);
    try {
      const response = await axios.get(
        `https://isovia.ca/fms_api/api/fetch_logs_data/${id}?start_date=${start}&end_date=${end}`
      );
      setLogs(response.data.logs || []);
    } catch (err) {
      setError(err.message || 'Error fetching log data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (driverId && startDate && endDate) {
      fetchLogData(driverId, startDate, endDate);
    }
  };

  // Generate Graph Data
  const getGraphData = (events) => {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`); // 24-hour labels
    const eventDurations = {
      off_duty: Array(24).fill(0),
      sleeper: Array(24).fill(0),
      driving: Array(24).fill(0),
      on_duty: Array(24).fill(0),
    };

    events.forEach(({ event }) => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time || start);
      const startHour = start.getHours();
      const endHour = end.getHours();

      for (let hour = startHour; hour <= endHour; hour++) {
        const hourStart = new Date(start);
        hourStart.setHours(hour, 0, 0, 0);

        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hour + 1, 0, 0, 0);

        const overlapStart = Math.max(start.getTime(), hourStart.getTime());
        const overlapEnd = Math.min(end.getTime(), hourEnd.getTime());
        const overlapDuration = (overlapEnd - overlapStart) / 3600000; // Duration in hours

        if (overlapDuration > 0) {
          if (!eventDurations[event.type]) {
            eventDurations[event.type] = Array(24).fill(0);
          }
          eventDurations[event.type][hour] += overlapDuration;
        }
      }
    });

    return {
      labels, // Time in hours
      datasets: [
        {
          label: 'Off Duty',
          data: eventDurations.off_duty,
          backgroundColor: 'gray',
        },
        {
          label: 'Sleeper',
          data: eventDurations.sleeper,
          backgroundColor: 'blue',
        },
        {
          label: 'Driving',
          data: eventDurations.driving,
          backgroundColor: 'red',
        },
        {
          label: 'On Duty',
          data: eventDurations.on_duty,
          backgroundColor: 'yellow',
        },
      ],
    };
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Time of Day (Hours)', // Label for the X-axis (time of day)
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Duty Types', // Label for the Y-axis (duty types)
        },
      },
    },
    indexAxis: 'y', // Ensure horizontal bars
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Driver Log Data</h2>

      {/* Driver Selection */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-3 align-items-center">
          <div className="col-md-3">
            <select
              className="form-select"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="" disabled>
                Select a Driver
              </option>
              {users.map((user) => (
                <option key={user.user.id} value={user.user.id}>
                  {user.user.first_name} {user.user.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary">
              Fetch Logs
            </button>
          </div>
        </div>
      </form>

      {/* Loading State */}
      {loading && <div className="text-center mt-5">Loading...</div>}

      {/* Error State */}
      {error && <div className="text-center mt-5 text-danger">Error: {error}</div>}

      {/* Log Data */}
      {!loading &&
        !error &&
        logs.length > 0 &&
        logs.map((logItem, index) => {
          const logData = logItem.log;

          return (
            <div key={logData.id} className="card mb-4 shadow-sm">
              <div className="card-body d-flex">
                {/* Title */}
                <div className="me-4">
                  <h5>Log Summary - #{index + 1}</h5>
                  <p><strong>Driver:</strong> {`${logData.driver_first_name} ${logData.driver_last_name}`}</p>
                  <p><strong>Date:</strong> {logData.date}</p>
                </div>

                {/* Graph */}
                <div style={{ flex: 1 }}>
                  <Bar data={getGraphData(logData.events || [])} options={chartOptions} />
                </div>
              </div>
            </div>
          );
        })}

      {/* No Logs Found */}
      {!loading && !error && logs.length === 0 && (
        <div className="text-center mt-5 text-warning">No log data found. Select a valid driver.</div>
      )}
    </div>
  );
};

export default LogTable;
