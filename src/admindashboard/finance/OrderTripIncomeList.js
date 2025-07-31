import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderTripIncomeList = () => {
  const [tripIncome, setTripIncome] = useState([]);
  const [totalnetamount, settotalnetamount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchTripIncome = async () => {
    try {
      const res = await axios.post(
        'https://isovia.ca/fms_api/api/ordertripIncome',
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
            console.log(res.data.message)
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
        'https://isovia.ca/fms_api/api/ordertripIncomebydate',
        formData,
        {
          headers: {
            Cookie: 'ci_session=b7ppgpubbm4jt4ogtiv4ci40f1v0u4g2',
          },
          withCredentials: true,
        }
      );

      if (res.data.status === 'success') {
        console.log(res.data.message)
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

  return (
    <div className="container my-4">
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
      ) : (<>
                <h5>Total Order Net Amount: $ {totalnetamount}</h5>
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
     </> )}
    </div>
  );
};

export default OrderTripIncomeList;
