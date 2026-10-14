// components/RevenueExpenses.js
import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueExpenses = () => {
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/getRevenueExpenses`);
        const rows = Array.isArray(response.data) ? response.data : [];
        setActivity(rows.map((row) => ({
          ...row,
          Revenue: Number(row.Revenue) || 0,
          Expenses: Number(row.Expenses) || 0,
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="accounting-chart-content">
      <div className="accounting-chart-title">
        <h3>Revenue &amp; expenses by month</h3>
        <p>Active orders, grouped by month name</p>
      </div>
      <div className="accounting-chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activity} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#e5ece8" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={72} />
            <Tooltip formatter={(value) => Number(value).toLocaleString()} />
            <Legend />
            <Bar dataKey="Revenue" fill="#087f78" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#df9141" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueExpenses;
