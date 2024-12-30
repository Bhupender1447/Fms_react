// components/AccountsPayableReceivableChart.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Sample data
const data = [
  { type: 'Payable', amount: 5000 },
  { type: 'Receivable', amount: 3000 },
  { type: 'Payable', amount: 2000 },
];

const AccountsPayableReceivableChart = () => {
  const[payrollData,setpayrollData]=useState([])
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/getpayableReceivable');
        setpayrollData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[])
  return (
    <div>
      <h2>Accounts Payable & Receivable Chart</h2>
      <BarChart
        width={500}
        height={300}
        data={payrollData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default AccountsPayableReceivableChart;
