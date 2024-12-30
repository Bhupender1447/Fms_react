// components/PayrollManagement.js
import React from 'react';

const employees = [
  { id: 1, name: 'John Doe', salary: 5000, position: 'Driver' },
  { id: 2, name: 'Jane Smith', salary: 4500, position: 'Accountant' },
];

const PayrollManagement = () => {
  return (
    <div>
      <h2>Payroll Management</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>${employee.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollManagement;
