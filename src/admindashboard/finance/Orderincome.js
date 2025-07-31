import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderIncomeList = () => {
  const [orderIncome, setOrderIncome] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const cookie = 'ci_session=vab8dhqhu68r5elb34ikf13ca60ivfs8';

  const fetchAllIncome = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://isovia.ca/fms_api/api/getOrderincome',
        {},
        {
          headers: { Cookie: cookie },
          withCredentials: true
        }
      );
      if (res.data.status) {
        setOrderIncome(res.data.message || []);
      } else {
        setOrderIncome([]);
      }
    } catch (err) {
      console.error('Error fetching all income:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredIncome = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both From and To dates');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fromdate', fromDate);
      formData.append('todate', toDate);

      const res = await axios.post(
        'https://isovia.ca/fms_api/api/orderIncomebyDate',
        formData,
        {
          headers: { Cookie: cookie },
          withCredentials: true
        }
      );

      if (res.data.status) {
        setOrderIncome(res.data.message || []);
      } else {
        setOrderIncome([]);
      }
    } catch (err) {
      console.error('Error fetching filtered income:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setFromDate('');
    setToDate('');
    fetchAllIncome();
  };

  useEffect(() => {
    fetchAllIncome(); // Load all data on mount
  }, []);

  return (
    <div className="container my-4">
      <h3>Order Income Records</h3>

      {/* Filter Inputs */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From Date"
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To Date"
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchFilteredIncome}>
            Filter
          </button>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={handleClearFilter}>
            Clear Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : orderIncome.length === 0 ? (
        <p>No income records found.</p>
      ) : (
   <table className="table table-bordered table-hover">
  <thead className="table-light">
    <tr>
      <th>ID</th>
      <th>Trip ID</th>
      <th>Company</th>
      <th>Order No</th>
      <th>Shipment Type</th>
      <th>Load Type</th>
      <th>Pickup Location</th>
      <th>Pickup Date & Time</th>
      <th>Delivery Location</th>
      <th>Delivery Date & Time</th>
      <th>Trailer Type</th>
      <th>Gross</th>
      <th>Net</th>
      <th>Driver</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {orderIncome.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.tmsTriptId}</td>
        <td>{item.company}</td>
        <td>{item.customer_orderno}</td>
        <td>{item.shipment_type}</td>
        <td>{item.load_type}</td>
        <td>{item.pickup_address}</td>
        <td>{item.pickup_date} {item.pickuptime}</td>
        <td>{item.delivery_address}</td>
        <td>{item.deliver_date} {item.deliverytime}</td>
        <td>{item.trailortype}</td>
        <td>${item.gross_amount}</td>
        <td>${item.net_amount}</td>
        <td>{item.driver_id}</td>
        <td>{item.status}</td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
};

export default OrderIncomeList;
