// components/AccountsPayableReceivableChart.js
import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AccountsPayableReceivableChart = () => {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/getpayableReceivable`);
        const totals = (Array.isArray(response.data) ? response.data : []).reduce((summary, row) => {
          const type = row.type === 'Receivable' ? 'Receivables' : row.type === 'Payable' ? 'Payables' : null;
          if (type) summary[type] += Number(row.amount) || 0;
          return summary;
        }, { Receivables: 0, Payables: 0 });
        setAccounts([
          { type: 'Receivables', amount: totals.Receivables },
          { type: 'Payables', amount: totals.Payables },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="accounting-chart-content">
      <div className="accounting-chart-title">
        <h3>Receivables &amp; payables</h3>
        <p>Active-order gross amounts and commissions</p>
      </div>
      <div className="accounting-chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={accounts} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#e5ece8" vertical={false} />
            <XAxis dataKey="type" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} width={72} />
            <Tooltip formatter={(value) => Number(value).toLocaleString()} />
            <Bar dataKey="amount" name="Amount" fill="#277da1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccountsPayableReceivableChart;
