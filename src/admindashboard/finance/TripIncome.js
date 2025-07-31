import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TripIncome = () => {
  const [incomes, setIncomes] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    fromdate: '',
    todate: ''
  });

  const driver_id = '10020'; // Change as needed
  const baseURL = 'https://isovia.ca/fms_api/api';

  const fetchAllIncome = async () => {
    const data = new FormData();
    data.append('driver_id', driver_id);

    try {
      const res = await axios.post(`${baseURL}/gettripIncome`, data, {
        withCredentials: true, // Important for session-based auth
      });
console.log(res.data)
      if (res.data.status) {
        setIncomes(res.data.message);
      } else {
        setIncomes([]);
      }
    } catch (error) {
      console.error('Fetch Income Error:', error);
    }
  };

  const fetchIncomeByDate = async () => {
    const data = new FormData();
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

  useEffect(() => {
    fetchAllIncome();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Trip Income</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={dateFilter.fromdate}
            onChange={(e) => setDateFilter({ ...dateFilter, fromdate: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={dateFilter.todate}
            onChange={(e) => setDateFilter({ ...dateFilter, todate: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={fetchIncomeByDate}>
            Filter by Date
          </button>
        </div>
      </div>

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
      <td colSpan="5" className="text-center">No records found</td>
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
