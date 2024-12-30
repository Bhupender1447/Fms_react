// components/RevenueExpenses.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'January', Revenue: 20000, Expenses: 12000 },
  { name: 'February', Revenue: 24000, Expenses: 15000 },
  { name: 'March', Revenue: 22000, Expenses: 17000 },
];

const RevenueExpenses = () => {
  const[payrollData,setpayrollData]=useState([])
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/getRevenueExpenses');
        setpayrollData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  },[])
  return (
    <div>
      <h2>Revenue vs Expenses</h2>
      <BarChart width={400} height={300} data={payrollData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Revenue" fill="#82ca9d" />
        <Bar dataKey="Expenses" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default RevenueExpenses;
