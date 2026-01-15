import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Discounttypes = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust the number of items per page

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/fetchdiscounttypesProductData')
      .then(res => setData(res.data))
      .catch(error => console.log(error))
  }, []);

  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_discounttypes'  // Adjust the type if necessary
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <h1>
          Manage
          <small>Discount Types</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Discount Types </li>
        </ol>
      </section>
      {/* Main content */}
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link to="/discounttypes/create" className="btn btn-primary">
              Add Discount Types
            </Link>
            <br /> <br />
            <div className="box">
              <div className="box-header">
                <div className="col-md-6 col-xs-12 pull pull-right">
                  <button id="exportButton" className="btn btn-default">
                    <span className="fa fa-file-pdf-o" /> Export to PDF
                  </button>
                  <button id="exportButtonExcl" className="btn btn-default">
                    <span className="fa fa-file-excel-o" /> Export to Excel
                  </button>
                </div>
              </div>
              <div className="box-body">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="dataTables_length" id="manageTable_length">
                      <label>
                        Show{" "}
                        <select
                          name="manageTable_length"
                          aria-controls="manageTable"
                          className="form-control input-sm"
                          value={itemsPerPage}
                          onChange={(e) => setCurrentPage(1)} // Reset to page 1 if items per page changes
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
                          // Add search functionality here if needed
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
                    >
                      <thead>
                        <tr role="row">
                          <th>PayType</th>
                          <th>Name</th>
                          <th>Company</th>
                          <th>Value</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item) => (
                          <tr key={item.id} role="row" className="odd">
                            <td>{item.paytype}</td>
                            <td>{item.name}</td>
                            <td>{item.company}</td>
                            <td>{item.value}</td>
                            <td>{item.remarks}</td>
                            <td>
                              <Link to={`/discounttypes/update/${item.id}`} className="btn btn-default">
                                <i className="fa fa-pencil" />
                              </Link>{" "}
                              <button
                                type="button"
                                className="btn btn-default"
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
                    <div className="dataTables_info" role="status" aria-live="polite">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <div className="dataTables_paginate paging_simple_numbers">
                      <ul className="pagination">
                        <li
                          className={`paginate_button previous ${currentPage === 1 ? "disabled" : ""}`}
                        >
                          <button
                            onClick={() => handleClick(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index + 1}
                            className={`paginate_button ${currentPage === index + 1 ? "active" : ""}`}
                          >
                            <button onClick={() => handleClick(index + 1)}>
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`paginate_button next ${currentPage === totalPages ? "disabled" : ""}`}
                        >
                          <button
                            onClick={() => handleClick(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
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

export default Discounttypes;
