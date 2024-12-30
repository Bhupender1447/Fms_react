// components/PayrollChart.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample Payroll Data


const PayrollChart = () => {
  const[payrollData,setpayrollData]=useState([])
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/getdriverpay');
        setpayrollData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[])
  return (
  <div style={{ marginTop: '20px' }}>
    <h2>Payroll Management - Salary Chart</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={payrollData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="salary" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)};

export default PayrollChart;
