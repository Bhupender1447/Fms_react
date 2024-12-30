// components/Dashboard.js
import React from 'react';
import RevenueExpenses from './RevenueExpenses';
import AccountsPayableReceivable from './AccountsPayableReceivable';
import PayrollManagement from './PayrollManagement';
import NetIncomeChart from './NetIncomeChart';
import PayrollChart from './PayrollChart';

const Dashboardaccounting = () => {
  return (
    <div className="content-wrapper">
      <h1>INTERNATIONAL ACCOUNTING STANDARDS
      </h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <RevenueExpenses />
        <AccountsPayableReceivable />
        <NetIncomeChart/>
      </div>
      {/* <PayrollManagement /> */}
      <PayrollChart/>
    </div>
  );
};

export default Dashboardaccounting ;
