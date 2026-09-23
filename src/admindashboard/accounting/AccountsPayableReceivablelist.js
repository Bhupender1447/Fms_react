import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

const AccountsPayableReceivableList = () => {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
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

  // Fetch summary data
  const fetchSummary = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}api/getpayableReceivablelist?type=${filterType}`;
      if (fromDate && toDate) url += `&from=${fromDate}&to=${toDate}`;

      const res = await axios.get(url);
      if (res.data) {
        // Format and calculate totals
        const formatted = res.data.map(item => ({
          ...item,
          amount: Number(item.amount) || 0
        }));
        setData(formatted);
        setCurrentPage(0);
        setSelectedPeriod(null);
        setDetails([]);
      }
    } catch (error) {
      console.error("Error fetching payable/receivable summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed transactions for a specific period
  const fetchPeriodDetails = async (period) => {
    try {
      const res = await axios.get(`${BASE_URL}api/getpayableReceivablelist?type=details&period=${period}`);
      if (res.data) {
        setSelectedPeriod(period);
        setDetails(res.data);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handlePageClick = (event) => setCurrentPage(event.selected);
  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  // Totals
  const totalReceivable = data
    .filter(d => d.type === 'Receivable')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalPayable = data
    .filter(d => d.type === 'Payable')
    .reduce((sum, d) => sum + d.amount, 0);

  const netBalance = totalReceivable - totalPayable;

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>Accounts <small>Payable & Receivable</small></h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">

            {/* FILTERS */}
            <div className="box" style={{ padding: '15px', marginBottom: '15px' }}>
              <div className="row">
                <div className="col-md-3">
                  <label>View By:</label>
                  <select
                    className="form-control"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label>From:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label>To:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                  />
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
                          <th>Customer ID</th>
                          <th>Customer Name</th>
                          <th>Type</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((item, i) => (
                          <tr
                            key={i}
                            style={{ cursor: 'pointer' }}
                            onClick={() => fetchPeriodDetails(item.name)}
                          >
                            <td>{item.id}</td>
                            <td><b>{item.name}</b></td>
                            <td style={{ color: item.type === 'Payable' ? 'red' : 'green' }}>
                              {item.type}
                            </td>
                            <td>${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}

                        {/* TOTALS ROW */}
                        <tr style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>
                          <td colSpan="3">Total Receivable</td>
                          <td style={{ color: 'green' }}>${totalReceivable.toFixed(2)}</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>
                          <td colSpan="3">Total Payable</td>
                          <td style={{ color: 'red' }}>${totalPayable.toFixed(2)}</td>
                        </tr>
                        <tr style={{ backgroundColor: '#e6f7ff', fontWeight: 'bold' }}>
                          <td colSpan="3">Net Balance</td>
                          <td style={{ color: netBalance >= 0 ? 'green' : 'red' }}>
                            ${netBalance.toFixed(2)}
                          </td>
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

            {/* DETAILS SECTION */}
            {selectedPeriod && (
              <div className="box">
                <div className="box-header">
                  <h3>Details for {selectedPeriod}</h3>
                  <button className="btn btn-danger btn-sm pull-right" onClick={() => setSelectedPeriod(null)}>Close</button>
                </div>
                <div className="box-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Driver</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.length > 0 ? (
                        details.map((t, i) => (
                          <tr key={i}>
                            <td>{t.createdat}</td>
                            <td>{t.order_number}</td>
                            <td>{t.customer_name}</td>
                            <td>{t.driver_name}</td>
                            <td style={{ color: t.type === 'Payable' ? 'red' : 'green' }}>{t.type}</td>
                            <td>${t.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">No details found</td>
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

export default AccountsPayableReceivableList;
