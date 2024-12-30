// components/AccountsTable.js
import React from 'react';

const accountsData = [
  { id: 1, type: 'Payable', amount: 5000, dueDate: '2024-10-25' },
  { id: 2, type: 'Receivable', amount: 8000, dueDate: '2024-10-30' },
  { id: 3, type: 'Payable', amount: 12000, dueDate: '2024-11-05' },
];

const AccountsTable = () => (
  <div style={{ marginTop: '20px' }}>
    <h2>Accounts Payable & Receivable</h2>
    <table border="1" cellPadding="10" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {accountsData.map((account) => (
          <tr key={account.id}>
            <td>{account.id}</td>
            <td>{account.type}</td>
            <td>${account.amount}</td>
            <td>{account.dueDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AccountsTable;
