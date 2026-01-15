import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Doctypes = () => {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/fetchdoctypesProductData')
      .then(res => setData(res.data))
      .catch(error => console.log(error))
  }, [])

  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_doctypes'  // Adjust the type if necessary
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

  // Calculate the indexes for current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <h1>
          Manage
          <small>Documents Type</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Documents</li>
        </ol>
      </section>
      {/* Main content */}
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link
              to="/doctypes/create"
              className="btn btn-primary"
            >
              Add Documents
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
                <div className="row">
                  <div className="col-sm-6">
                    <div className="dataTables_length">
                      <label>
                        Show{" "}
                        <select
                          value={itemsPerPage}
                          onChange={e => setItemsPerPage(Number(e.target.value))}
                          className="form-control input-sm"
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
                    <div className="dataTables_filter">
                      <label>
                        Search:
                        <input
                          type="search"
                          className="form-control input-sm"
                          placeholder=""
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <table className="table table-bordered table-striped dataTable no-footer">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Module</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems && currentItems.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.module}</td>
                            <td>{item.remarks}</td>
                            <td>
                              <Link
                                to={`/doctypes/update/${item.id}`}
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
                    <div className="dataTables_info" role="status" aria-live="polite">
                      Showing {indexOfFirstItem + 1} to {indexOfLastItem > data.length ? data.length : indexOfLastItem} of {data.length} entries
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <div className="dataTables_paginate paging_simple_numbers">
                      <ul className="pagination">
                        <li className={`paginate_button previous ${currentPage === 1 ? 'disabled' : ''}`}>
                          <Link
                            to="#!"
                            onClick={() => paginate(currentPage - 1)}
                          >
                            Previous
                          </Link>
                        </li>
                        {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) => (
                          <li key={i} className={`paginate_button ${currentPage === i + 1 ? 'active' : ''}`}>
                            <Link
                              to="#!"
                              onClick={() => paginate(i + 1)}
                            >
                              {i + 1}
                            </Link>
                          </li>
                        ))}
                        <li className={`paginate_button next ${currentPage === Math.ceil(data.length / itemsPerPage) ? 'disabled' : ''}`}>
                          <Link
                            to="#!"
                            onClick={() => paginate(currentPage + 1)}
                          >
                            Next
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Doctypes
