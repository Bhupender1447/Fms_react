import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Owners = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/fetchownersProductData')
      .then(res => setData(res.data.data))
      .catch(err => console.log(err));
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
console.log(data)
  const offset = currentPage * itemsPerPage;
  const currentData = data?.slice(offset, offset + itemsPerPage);

  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_truck_owners'  // Adjust the type if necessary
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
          <small>Truck Owners</small>
        </h1>
      </section>
      {/* Main content */}
      <section className="content">
        {/* Small boxes (Stat box) */}
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <div className="alert alert-success alert-dismissible" role="alert">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              Successfully updated{" "}
            </div>
            <Link to={'/owners/create'}
              className="btn btn-primary"
            >
              Add Truck Owners
            </Link>
            {/*        <Link to="" class="btn btn-success">View Motors</Link> */}
            <br /> <br />
            <div className="box">
              <div className="box-header">
                <div className="col-md-6 col-xs-12 pull pull-right">
                  <button id="exportButton" className="btn btn-info ">
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
                        style={{ width: 1242 }}
                      >
                        <thead>
                          <tr role="row">
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Id: activate to sort column ascending"
                              style={{ width: "25.2px" }}
                            >
                              Id
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Name: activate to sort column ascending"
                              style={{ width: "57.2px" }}
                            >
                              Name
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Address1: activate to sort column ascending"
                              style={{ width: "154.2px" }}
                            >
                              Address1
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Address2: activate to sort column ascending"
                              style={{ width: "154.2px" }}
                            >
                              Address2
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Country: activate to sort column ascending"
                              style={{ width: "77.2px" }}
                            >
                              Country
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="State: activate to sort column ascending"
                              style={{ width: "53.2px" }}
                            >
                              State
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="City: activate to sort column ascending"
                              style={{ width: "43.2px" }}
                            >
                              City
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Zip: activate to sort column ascending"
                              style={{ width: "41.2px" }}
                            >
                              Zip
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Action: activate to sort column ascending"
                              style={{ width: 288 }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData&&currentData?.map(item => (
                            <tr role="row" className="odd" key={item.id}>
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>{item.address1}</td>
                              <td>{item.address2}</td>
                              <td>{item.country}</td>
                              <td>{item.state}</td>
                              <td>{item.city}</td>
                              <td>{item.zip}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-success btn-xs"
                               
                                  data-toggle="modal"
                                  data-target="#defaultModal"
                                >
                                  Default Charges
                                </button>{" "}
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs"
                               
                                  data-toggle="modal"
                                  data-target="#paymentModal"
                                >
                                  Payment Profile
                                </button>
                                <Link
                                  to={`/owners/update/${item.id}`}
                                  className="btn btn-default btn-xs"
                                >
                                  <i className="fa fa-pencil" />
                                </Link>{" "}
                                <button
                                  type="button"
                                  className="btn btn-default btn-xs"
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

export default Owners;
