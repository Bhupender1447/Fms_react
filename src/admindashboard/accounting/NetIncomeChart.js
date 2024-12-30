import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const NetIncomeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/getlocationIncome');

        // Filter out entries with null or zero values
        const filteredData = response.data.filter(entry => entry.value && parseFloat(entry.value) > 0);

        // Convert value to number
        const formattedData = filteredData.map(entry => ({
          name: entry.name,
          value: parseFloat(entry.value),
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Title can be added here if needed */}
      <h2 style={{ textAlign: 'center' }}>Net Income by Location</h2>
      <AreaChart width={400} height={300} data={data} style={{ margin: '0 auto' }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="value" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.6} />
      </AreaChart>
    </div>
  );
};

export default NetIncomeChart;
