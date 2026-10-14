// components/PayrollChart.js
import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const PayrollChart = () => {
  const [workRows, setWorkRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/getdriverpay`);
        setWorkRows(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const driverOrderCounts = Object.values(workRows.reduce((counts, row) => {
    const countedInOrder = new Set();
    [
      { id: row.driver_id, name: [row.driver_fname, row.driver_lname].filter(Boolean).join(' ') },
      { id: row.codriver_id, name: [row.codriver_fname, row.codriver_lname].filter(Boolean).join(' ') },
    ].forEach((driver) => {
      if (!driver.id || driver.id === '0' || driver.id === 'na') return;
      const key = String(driver.id);
      if (countedInOrder.has(key)) return;
      countedInOrder.add(key);
      if (!counts[key]) counts[key] = { name: driver.name || `Driver ${key}`, orders: 0 };
      counts[key].orders += 1;
    });
    return counts;
  }, {}));

  return (
    <div className="accounting-chart-content">
      <div className="accounting-chart-title">
        <h3>Assigned orders by driver</h3>
        <p>Work counts only; the current feed does not provide pay amounts</p>
      </div>
      <div className="accounting-chart-frame accounting-chart-frame-short">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={driverOrderCounts} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#e5ece8" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={44} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" name="Assigned orders" fill="#bd6e73" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
};

export default PayrollChart;
