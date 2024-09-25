import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Income = () => {
  const data = [
    { driverName: 'John Doe', trip: 'Trip to Downtown', address: '123 Main St, Springfield', date: '2024-07-23', income: 50.00 },
    { driverName: 'Jane Smith', trip: 'Trip to Airport', address: '456 Elm St, Springfield', date: '2024-07-22', income: 75.00 },
    // Add more rows as needed
  ];

  const [filteredData, setFilteredData] = useState(data);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = data.filter(row => {
        const rowDate = new Date(row.date);
        return rowDate >= startDate && rowDate <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

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
        <button onClick={handleFilter}>Filter</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Driver Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Trip</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Address</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Income</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.driverName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.trip}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.address}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.date}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${row.income.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Income;
