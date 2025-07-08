import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaExclamationCircle } from "react-icons/fa";
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
import './driverlog.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const statusMap = {
  on: "ON",
  off: "OFF",
};



// Compute total minutes per status
const getStatusTotals = (blocks) => {
  const totals = { OFF: 0, SB: 0, D: 0, ON: 0 };
  blocks.forEach((b) => {
    if (totals[b.status] !== undefined) {
      totals[b.status] += (b.end - b.start) * 60;
    }
  });
  return totals;
};


const TripLogChart = () => {
  const [logs, setLogs] = useState([]);
  const [todayBlocks, setTodayBlocks] = useState([]);
  const [statusTotals, setStatusTotals] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://isovia.ca/fms_api/api/list_trips?driver_id=10020")
      .then((res) => {
        if (res.data.status === "success") {
          setLogs(res.data.data);
          const today = new Date().toDateString();
          const todayBlocks = buildBlocksForDate(res.data.data, today);
          setTodayBlocks(todayBlocks);
          setStatusTotals(getStatusTotals(todayBlocks));
        }
      });
  }, []);

  const buildBlocksForDate = (data, date) => {
    const trips = data.filter(
      (t) => new Date(t.login_time).toDateString() === date
    );
    const blocks = [];
    let last = 0;
    trips.forEach((trip) => {
      const start = new Date(trip.login_time);
      const end = trip.logout_time
        ? new Date(trip.logout_time)
        : new Date();
      const s = start.getHours() + start.getMinutes() / 60;
      const e = end.getHours() + end.getMinutes() / 60;
      if (s > last) {
        blocks.push({ status: "OFF", start: last, end: s });
      }
      blocks.push({
        status: statusMap[trip.status] || "OFF",
        start: s,
        end: e,
      });
      last = e;
    });
    if (last < 24) blocks.push({ status: "OFF", start: last, end: 24 });
    return blocks;
  };

  const last14Dates = Array.from(
    new Set(logs.map((l) => new Date(l.login_time).toDateString()))
  ).slice(0, 14);

  // Chart data
  const chartData = {
    labels: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    datasets: [
      {
        label: 'Drive Time (hours)',
        data: [10, 12, 8, 14, 9, 11, 7],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Drive Time Summary',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 24,
      },
    },
  };

  // Format current time
  const now = new Date();
  const currentTime = `${now.getHours() % 12 || 12}.${now.getMinutes()} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
  const currentDay = now.toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="container-fluid dashboard">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="dashboard-card">
     
            
    
           
            
            {/* Chart Section */}
            <div className="chart-section">
              <Bar data={chartData} options={chartOptions} />
            </div>
            
            <div className="divider"></div>
            
            {/* Last 14 Days Section */}
            <div className="history-section">
              <h4>LAST 14 DAYS</h4>
              
              {last14Dates.map((date, idx) => {
                const blocks = buildBlocksForDate(logs, date);
                const totals = getStatusTotals(blocks);
                const totalMins = totals["ON"] + totals["D"] + totals["SB"] + totals["OFF"];
                const totalHrs = Math.floor(totalMins / 60);
                const remMins = totalMins % 60;
                const formattedDate = new Date(date).toLocaleString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                }).toUpperCase();

                return (
                  <React.Fragment key={idx}>
                    <div 
                      className="day-item" 
                      onClick={() => navigate("/daily-log-detail", { state: { date, blocks } })}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="day-title">{formattedDate}</span>
                      <div className="day-time">{totalHrs} hr {remMins} min</div>
                      <div className="day-detail">No Inspections <FaExclamationCircle color="red" /></div>
                    </div>
                    {idx < last14Dates.length - 1 && <div className="divider-light"></div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripLogChart;