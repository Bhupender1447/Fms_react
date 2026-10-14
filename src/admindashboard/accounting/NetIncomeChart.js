import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = { income: '#087f78', grid: '#e5ece8' };

const NetIncomeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/getlocationIncome`);

        const rawData = Array.isArray(response.data) ? response.data : [];
        const formattedData = rawData
          .map((entry) => ({
            name: entry.name || 'Unspecified location',
            value: entry.value === null || entry.value === '' ? null : Number(entry.value),
          }))
          .filter((entry) => entry.value !== null && Number.isFinite(entry.value));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="accounting-chart-content">
      <div className="accounting-chart-title">
        <h3>Net income by location</h3>
        <p>Net order amounts grouped by delivery address</p>
      </div>
      <div className="accounting-chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 16, bottom: 18, left: 4 }}>
            <CartesianGrid stroke={COLORS.grid} vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} angle={-24} textAnchor="end" height={62} />
            <YAxis axisLine={false} tickLine={false} width={72} />
            <Tooltip formatter={(value) => Number(value).toLocaleString()} />
            <Area type="monotone" dataKey="value" name="Net amount" stroke={COLORS.income} fill={COLORS.income} fillOpacity={0.18} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetIncomeChart;
