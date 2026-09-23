import React, { useEffect, useState } from 'react';
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

const OrderTripIncomeList = () => {
  const [tripIncome, setTripIncome] = useState([]);
  const [totalnetamount, settotalnetamount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchTripIncome = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}api/ordertripIncome`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Cookie: 'ci_session=b7ppgpubbm4jt4ogtiv4ci40f1v0u4g2',
          },
          withCredentials: true,
        }
      );

      if (res.data.status === 'success') {
        settotalnetamount(res.data.total_net_amount);
        setTripIncome(res.data.message || []);
      }
    } catch (error) {
      console.error('Error fetching trip income:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = async () => {
    if (!fromDate || !toDate) return alert("Select both dates");

    const formData = new FormData();
    formData.append('fromdate', fromDate);
    formData.append('todate', toDate);

    try {
      const res = await axios.post(
        `${BASE_URL}api/ordertripIncomebydate`,
        formData,
        {
          headers: {
            Cookie: 'ci_session=b7ppgpubbm4jt4ogtiv4ci40f1v0u4g2',
          },
          withCredentials: true,
        }
      );

      if (res.data.status === 'success') {
        settotalnetamount(res.data.total_net_amount);
        setTripIncome(res.data.message || []);
      }
    } catch (err) {
      console.error('Date filter error:', err);
    }
  };

  useEffect(() => {
    fetchTripIncome();
  }, []);

  const getChartData = () => {
    const labels = Array.isArray(tripIncome)
      ? tripIncome.map((item, i) => item.customer_orderno || `Trip ${i + 1}`)
      : [];

    const data = Array.isArray(tripIncome)
      ? tripIncome.map(item => parseFloat(item.net_amount) || 0)
      : [];

    return {
      labels,
      datasets: [
        {
          label: 'Net Amount ($)',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          barThickness: 30,
          maxBarThickness: 40,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Net Income by Order',
      },
    },
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h3>Trip Income Records</h3>

      <div className="row my-3">
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary" onClick={filterByDate}>
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tripIncome.length === 0 ? (
        <p>No trip income found.</p>
      ) : (
        <>
          <h5>Total Order Net Amount: $ {totalnetamount}</h5>

          {/* Chart section */}
          {tripIncome.length > 0 && (
            <div className="my-4">
              <h5>Net Amount Chart</h5>
              <Bar data={getChartData()} options={chartOptions} />
            </div>
          )}

          {/* Table section */}
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Trip ID</th>
                <th>Company</th>
                <th>Order No</th>
                <th>Gross</th>
                <th>Net</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tripIncome.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.tmsTriptId}</td>
                  <td>{item.company}</td>
                  <td>{item.customer_orderno}</td>
                  <td>{item.gross_amount}</td>
                  <td>{item.net_amount}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OrderTripIncomeList;
