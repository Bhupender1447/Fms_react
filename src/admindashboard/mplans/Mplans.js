import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Mplans = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/fetchmplansProductData')
      .then(res => setData(res.data))
      .catch(error => console.log(error))
  }, []);

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle item removal
  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_mplans'  // Adjust the type if necessary
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'ci_session=06vlfcjjenfs9pp507kpsbcetr7h8va3'
          }
        }
      );
      console.log("Response:", response.data);
      // Remove the item from the state after successful deletion
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <h1>
          Manage
          <small>Maintenance Plan</small>
        </h1>
      </section>
      {/* Main content */}
      <section className="content">
        {/* Small boxes (Stat box) */}
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link
              to="/mplans/create"
              className="btn btn-primary"
            >
              Add Maintenance Plan
            </Link>
            <br /> <br />
            <div className="box">
              <div className="box-header">
                <div className="col-md-6 col-xs-12 pull pull-right">
                  <button id="exportButton" className="btn btn-default ">
                    <span className="fa fa-file-pdf-o" /> Export to PDF
                  </button>
                  <button id="exportButtonExcl" className="btn btn-default">
                    <span className="fa fa-file-excel-o" /> Export to Excel
                  </button>
                </div>
              </div>
              {/* /.box-header */}
              <div className="box-body">
                <div
                  id="manageTable_wrapper"
                  className="dataTables_wrapper form-inline dt-bootstrap no-footer"
                >
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="dataTables_length" id="manageTable_length">
                        <label>
                          Show{" "}
                          <select
                            name="manageTable_length"
                            aria-controls="manageTable"
                            className="form-control input-sm"
                            onChange={(e) => setCurrentPage(1)}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>{" "}
                          entries
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div id="manageTable_filter" className="dataTables_filter">
                        <label>
                          Search:
                          <input
                            type="search"
                            className="form-control input-sm"
                            placeholder=""
                            aria-controls="manageTable"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <table
                        id="manageTable"
                        className="table table-bordered table-striped dataTable no-footer"
                        role="grid"
                        aria-describedby="manageTable_info"
                        style={{ width: 1240 }}
                      >
                        <thead>
                          <tr role="row">
                            <th>MFor</th>
                            <th>Company</th>
                            <th>MType</th>
                            <th>ScheduledStatus</th>
                            <th>Amount</th>
                            <th>Currency</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map(item => (
                            <tr key={item.id} role="row" className="odd">
                              <td>{item.mfor}</td>
                              <td>{item.company}</td>
                              <td>{item.mtype}</td>
                              <td>{item.sstatus}</td>
                              <td>{item.amount}</td>
                              <td>{item.currency}</td>
                              <td>
                                <Link to={`/mplans/update/${item.id}`} className="btn btn-default btn-xs">
                                  <i className="fa fa-pencil" />
                                </Link>{" "}
                                <button
                                  type="button"
                                  className="btn btn-default btn-xs"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <i className="fa fa-trash" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5">
                      <div
                        className="dataTables_info"
                        id="manageTable_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <div
                        className="dataTables_paginate paging_simple_numbers"
                        id="manageTable_paginate"
                      >
                        <ul className="pagination">
                          {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map(number => (
                            <li
                              key={number + 1}
                              className={`paginate_button ${currentPage === number + 1 ? 'active' : ''}`}
                            >
                              <Link
                                to="#!"
                                onClick={() => paginate(number + 1)}
                              >
                                {number + 1}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /.box-body */}
            </div>
            {/* /.box */}
          </div>
          {/* col-md-12 */}
        </div>
        {/* /.row */}
      </section>
      {/* /.content */}
    </div>
  )
}

export default Mplans
