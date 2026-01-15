import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Terms = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/fetchtermsProductData')
      .then(res => setData(res.data))
      .catch(error => console.log(error));
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_terms'  // Adjust the type if necessary
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

  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <h1>
          Manage
          <small>Terms</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Terms</li>
        </ol>
      </section>
      {/* Main content */}
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link to="/terms/create" className="btn btn-primary">
              Add terms
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
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                        style={{ width: 1219 }}
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
                              style={{ width: "179.2px" }}
                            >
                              Name
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Company: activate to sort column ascending"
                              style={{ width: "252.2px" }}
                            >
                              Company
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Value: activate to sort column ascending"
                              style={{ width: "175.2px" }}
                            >
                              Value
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Active: activate to sort column ascending"
                              style={{ width: "190.2px" }}
                            >
                              Active
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Action: activate to sort column ascending"
                              style={{ width: 229 }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map(item => (
                            <tr role="row" className="odd" key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.company}</td>
                              <td>{item.value}</td>
                              <td>{item.active ? 'Yes' : 'No'}</td>
                              <td>
                                <Link
                                  to={`/terms/update/${item.id}`}
                                  className="btn btn-default"
                                >
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
                      <div
                        className="dataTables_info"
                        id="manageTable_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing {offset + 1} to {offset + currentData.length} of {data.length} entries
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <div
                        className="dataTables_paginate paging_simple_numbers"
                        id="manageTable_paginate"
                      >
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          breakClassName={"break-me"}
                          pageCount={Math.ceil(data.length / itemsPerPage)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                        />
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
  );
};

export default Terms;
