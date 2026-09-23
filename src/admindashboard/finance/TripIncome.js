import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TripIncome = () => {
  const [incomes, setIncomes] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    fromdate: '',
    todate: ''
  });
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');

  const baseURL = `${BASE_URL}api`;
  const cookie = 'ci_session=8ecio0n0r8ive2d86cgrn5cvf93rtj1o'; // replace if needed

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${baseURL}/fetchdriversProductData`, {
        headers: { Cookie: cookie },
        withCredentials: true,
      });
      setDrivers(res.data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    }
  };

  const fetchIncomeByDriver = async (driverId) => {
    const data = new FormData();
    data.append('driver_id', driverId);

    try {
      const res = await axios.post(`${baseURL}/gettripIncome`, data, {
        withCredentials: true,
      });

      if (res.data.status) {
        const trips = res.data.message;
        setIncomes(Array.isArray(trips) ? trips : []);
      } else {
        setIncomes([]);
      }
    } catch (error) {
      console.error('Fetch Income Error:', error);
    }
  };

  const fetchIncomeByDate = async () => {
    if (!selectedDriver) {
      alert('Please select a driver first');
      return;
    }

    const data = new FormData();
    data.append('driver_id', selectedDriver);
    data.append('fromdate', dateFilter.fromdate);
    data.append('todate', dateFilter.todate);

    try {
      const res = await axios.post(`${baseURL}/tripIncomebyDate`, data, {
        withCredentials: true,
      });

      if (res.data.status) {
        setIncomes(res.data.data);
      } else {
        setIncomes([]);
      }
    } catch (error) {
      console.error('Date Filter Error:', error);
    }
  };

  const handleDriverChange = (e) => {
    const driverId = e.target.value;
    setSelectedDriver(driverId);
    if (driverId) {
      fetchIncomeByDriver(driverId);
    } else {
      setIncomes([]);
    }
  };

  const getChartData = () => {
    const labels = incomes.map((inc, index) => inc.customer_orderno || `Trip ${index + 1}`);
    const data = incomes.map(inc => parseFloat(inc.net_amount) || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Net Income per Trip',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          barThickness: 30,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Trip-wise Net Income',
      },
    },
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2 className="mb-4">Trip Income</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedDriver}
            onChange={handleDriverChange}
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fname} {driver.lname} (ID: {driver.id})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateFilter.fromdate}
            onChange={(e) => setDateFilter({ ...dateFilter, fromdate: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateFilter.todate}
            onChange={(e) => setDateFilter({ ...dateFilter, todate: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={fetchIncomeByDate}
            disabled={!selectedDriver}
          >
            Filter by Date
          </button>
        </div>
      </div>

      {/* Chart Section */}
      {incomes.length > 0 && (
        <div className="my-4">
          <h5>Trip Income Chart</h5>
          <Bar data={getChartData()} options={chartOptions} />
        </div>
      )}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Trip Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {incomes.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                {selectedDriver ? 'No records found' : 'Please select a driver to view trip incomes'}
              </td>
            </tr>
          ) : (
            incomes.map((item, index) => (
              <tr key={index}>
                <td colSpan="5">
                  <div className="card mb-3">
                    <div className="card-header">
                      <strong>Trip #{item.tmsTriptId}</strong> | Status: <b>{item.status}</b>
                    </div>
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-md-4"><strong>Customer Order #:</strong> {item.customer_orderno}</div>
                        <div className="col-md-4"><strong>Company:</strong> {item.company}</div>
                        <div className="col-md-4"><strong>Shipment Type:</strong> {item.shipment_type}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <strong>Pickup:</strong><br />
                          Address: {item.pickup_address}<br />
                          Date: {item.pickup_date} {item.pickuptime}<br />
                          Desc: {item.pickup_desc}
                        </div>
                        <div className="col-md-6">
                          <strong>Delivery:</strong><br />
                          Address: {item.delivery_address}<br />
                          Date: {item.deliver_date} {item.deliverytime}<br />
                          Desc: {item.delivery_desc}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-3"><strong>Gross:</strong> ${item.gross_amount}</div>
                        <div className="col-md-3"><strong>HST:</strong> ${item.hst_amount}</div>
                        <div className="col-md-3"><strong>CST:</strong> ${item.cst_amount}</div>
                        <div className="col-md-3"><strong>Net:</strong> ${item.net_amount}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4"><strong>Driver ID:</strong> {item.driver_id}</div>
                        <div className="col-md-4"><strong>Truck ID:</strong> {item.truck_id}</div>
                        <div className="col-md-4"><strong>Trailer Type:</strong> {item.trailortype}</div>
                      </div>
                      <div><strong>Remarks:</strong> {item.remarks || 'N/A'}</div>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TripIncome;
