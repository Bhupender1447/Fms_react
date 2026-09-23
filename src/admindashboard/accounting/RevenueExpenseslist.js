import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

const RevenueExpensesList = () => {
  const [data, setData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState('monthly'); // daily, weekly, monthly, quarterly, yearly
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchSummary();
  }, [filterType, fromDate, toDate]);

  // Fetch filtered summary
  const fetchSummary = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}api/getRevenueExpenseslist?type=${filterType}`;
      if (fromDate && toDate) url += `&from=${fromDate}&to=${toDate}`;

      const res = await axios.get(url);
      if (res.data) {
        // Calculate profit for each row
        const withProfit = res.data.map(item => ({
          ...item,
          profit: (Number(item.revenue) || 0) - (Number(item.expenses) || 0)
        }));
        setData(withProfit);
        setCurrentPage(0);
        setSelectedPeriod(null);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions for a specific period
  const fetchTransactions = async (period) => {
    try {
      let url = `${BASE_URL}api/getRevenueExpenseslist?type=details&period=${period}`;
      if (fromDate && toDate) url += `&from=${fromDate}&to=${toDate}`;

      const res = await axios.get(url);
      if (res.data) {
        // Calculate profit for each transaction
        const withProfit = res.data.map(t => ({
          ...t,
          profit: (Number(t.income) || 0) - (Number(t.expense) || 0)
        }));
        setSelectedPeriod(period);
        setTransactions(withProfit);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handlePageClick = (event) => setCurrentPage(event.selected);
  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  // Calculate totals for summary table
  const totalRevenue = data.reduce((sum, row) => sum + Number(row.revenue || 0), 0);
  const totalExpenses = data.reduce((sum, row) => sum + Number(row.expenses || 0), 0);
  const totalProfit = data.reduce((sum, row) => sum + Number(row.profit || 0), 0);
  const totalOrders = data.reduce((sum, row) => sum + Number(row.total_orders || 0), 0);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>Reports <small>Revenue & Expenses</small></h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">

            {/* FILTERS */}
            <div className="box" style={{ padding: '15px', marginBottom: '15px' }}>
              <div className="row">
                <div className="col-md-3">
                  <label>View By:</label>
                  <select className="form-control" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>From:</label>
                  <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </div>
                <div className="col-md-3">
                  <label>To:</label>
                  <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
                </div>
                <div className="col-md-3" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={fetchSummary}>Apply</button>
                </div>
              </div>
            </div>

            {/* SUMMARY TABLE */}
            <div className="box">
              <div className="box-body">
                {loading ? (
                  <div className="text-center"><h4>Loading...</h4></div>
                ) : (
                  <>
                    <table className="table table-bordered table-striped dataTable no-footer">
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Revenue</th>
                          <th>Expenses</th>
                          <th>Profit</th>
                          <th>Total Orders</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((item, i) => (
                          <tr key={i} style={{ cursor: 'pointer' }} onClick={() => fetchTransactions(item.period)}>
                            <td><b>{item.period}</b></td>
                            <td>${item.revenue}</td>
                            <td>${item.expenses}</td>
                            <td style={{ color: item.profit >= 0 ? 'green' : 'red' }}>${item.profit}</td>
                            <td>{item.total_orders}</td>
                          </tr>
                        ))}

                        {/* TOTAL ROW */}
                        <tr style={{ backgroundColor: '#e6f7ff', fontWeight: 'bold' }}>
                          <td>Overall Total</td>
                          <td>${totalRevenue.toFixed(2)}</td>
                          <td>${totalExpenses.toFixed(2)}</td>
                          <td style={{ color: totalProfit >= 0 ? 'green' : 'red' }}>${totalProfit.toFixed(2)}</td>
                          <td>{totalOrders}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div className="row">
                      <div className="col-sm-5">
                        <div className="dataTables_info">
                          Showing {offset + 1} to {offset + currentData.length} of {data.length} entries
                        </div>
                      </div>
                      <div className="col-sm-7">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          pageCount={Math.ceil(data.length / itemsPerPage)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* TRANSACTIONS DRILLDOWN */}
            {selectedPeriod && (
              <div className="box">
                <div className="box-header">
                  <h3>Transactions for {selectedPeriod}</h3>
                  <button className="btn btn-danger btn-sm pull-right" onClick={() => setSelectedPeriod(null)}>Close</button>
                </div>
                <div className="box-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Order ID</th>
                        <th>Driver</th>
                        <th>Customer</th>
                        <th>Income</th>
                        <th>Expense</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((t, i) => (
                          <tr key={i}>
                            <td>{t.createdat}</td>
                            <td>{t.order_number}</td>
                            <td>{t.driver_name}</td>
                            <td>{t.customer_name}</td>
                            <td style={{ color: 'green' }}>${t.income}</td>
                            <td style={{ color: 'red' }}>${t.expense}</td>
                            <td style={{ color: t.profit >= 0 ? 'green' : 'red' }}>${t.profit}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">No transactions found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default RevenueExpensesList;
