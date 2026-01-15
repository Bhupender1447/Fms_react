import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Etypes = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = () => {
    axios.get('https://isovia.ca/fms_api/api/fetchetypesProductData')
      .then(res => setData(res.data))
      .catch(error => console.log(error));
  };


  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_etypes'  // Adjust the type if necessary
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage
          <small>Expense Type</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="../cpanel/">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Expense</li>
        </ol>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link
              to="/etypes/create"
              className="btn btn-primary"
            >
              Add Expense
            </Link>
            <br /> <br />
            <div className="box">
              <div className="col-md-6 col-xs-12 pull pull-right">
                <button id="exportButton" className="btn btn-default ">
                  <span className="fa fa-file-pdf-o" /> Export to PDF
                </button>
                <button id="exportButtonExcl" className="btn btn-default">
                  <span className="fa fa-file-excel-o" /> Export to Excel
                </button>
              </div>
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
                            value={itemsPerPage}
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
                        style={{ width: 1239 }}
                      >
                        <thead>
                          <tr role="row">
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Name: activate to sort column ascending"
                              style={{ width: "204.2px" }}
                            >
                              Name
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="EType: activate to sort column ascending"
                              style={{ width: "350.2px" }}
                            >
                              EType
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Remarks: activate to sort column ascending"
                              style={{ width: "271.2px" }}
                            >
                              Remarks
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Action: activate to sort column ascending"
                              style={{ width: 259 }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map(item => (
                            <tr key={item.id} role="row" className="odd">
                              <td>{item.name}</td>
                              <td>{item.etype}</td>
                              <td>{item.remarks}</td>
                              <td>
                                <Link
                                  to={`/etypes/update/${item.id}`}
                                  className="btn btn-default"
                                >
                                  <i className="fa fa-pencil" />
                                </Link>{" "}
                                <button
                                  type="button"
                                  className="btn btn-default"
                                  onClick={() => handleRemove(item.id)}
                                  data-toggle="modal"
                                  data-target="#removeModal"
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
                          <li
                            className={`paginate_button previous ${currentPage === 1 ? 'disabled' : ''}`}
                            id="manageTable_previous"
                          >
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              aria-controls="manageTable"
                              data-dt-idx={0}
                              tabIndex={0}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(totalPages).keys()].map(page => (
                            <li
                              key={page + 1}
                              className={`paginate_button ${currentPage === page + 1 ? 'active' : ''}`}
                            >
                              <button
                                onClick={() => paginate(page + 1)}
                                aria-controls="manageTable"
                                data-dt-idx={page + 1}
                                tabIndex={0}
                              >
                                {page + 1}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`paginate_button next ${currentPage === totalPages ? 'disabled' : ''}`}
                            id="manageTable_next"
                          >
                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              aria-controls="manageTable"
                              data-dt-idx={2}
                              tabIndex={0}
                            >
                              Next
                            </button>
                          </li>
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

export default Etypes
