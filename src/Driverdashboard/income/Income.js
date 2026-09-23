import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL } from '../../config';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const baseURL = `${BASE_URL}api`;
  const logindetail = JSON.parse(localStorage.getItem('logindetail'));
  const driverId = logindetail?.id;

  const fetchIncomeByDriver = async (driverId) => {
    const data = new FormData();
    data.append('driver_id', driverId);

    try {
      const res = await axios.post(`${baseURL}/gettripIncome`, data, {
        withCredentials: true,
      });

      if (res.data.status) {
        const trips = res.data.message;
        const formatted = Array.isArray(trips)
          ? trips.map(item => ({
            driverName: `Driver #${item.driver_id}`,
            trip: `${item.pickup_desc || 'Pickup'} → ${item.delivery_desc || 'Delivery'}`,
            address: `${item.pickup_address} → ${item.delivery_address}`,
            date: item.createdat?.split(' ')[0],
            income: isNaN(parseFloat(item.net_amount)) ? 0 : parseFloat(item.net_amount),
          }))
          : [];

        setIncomes(formatted);
        setFilteredData(formatted);
      } else {
        setIncomes([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Fetch Income Error:', error);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = incomes.filter(row => {
        const rowDate = new Date(row.date);
        return rowDate >= startDate && rowDate <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(incomes);
    }
  };

  useEffect(() => {
    if (driverId) {
      fetchIncomeByDriver(driverId);
    }
  }, [driverId]);

  const totalIncome = filteredData.reduce((sum, row) => sum + (row.income || 0), 0);

  return (
    <div className="content-wrapper">
      <h1>Driver Income Details</h1>

      <div style={{ marginBottom: '20px' }}>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
        />
        <button onClick={handleFilter} style={{ marginLeft: '10px' }}>Filter</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Driver Name</th>
            <th style={thStyle}>Trip</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Income</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td style={tdStyle}>{row.driverName}</td>
              <td style={tdStyle}>{row.trip}</td>
              <td style={tdStyle}>{row.address}</td>
              <td style={tdStyle}>{row.date}</td>
              <td style={tdStyle}>${(row.income ?? 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={tdStyle}><strong>Total</strong></td>
            <td style={tdStyle}><strong>${totalIncome.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// Styles
const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};
const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

export default Income;
