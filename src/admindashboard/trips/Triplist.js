import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Triplist = () => {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("https://isovia.ca/fms_api/api/tipsfetchProductData/1")
      .then((res) => setList(res.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(list);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = list.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(list.length / itemsPerPage);

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>
          Manage
          <small>Trips</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Orders</li>
        </ol>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <br /> <br />
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Manage trips</h3>
              </div>
              <div className="box-body">
                <div
                  id="manageTable_wrapper"
                  className="dataTables_wrapper form-inline dt-bootstrap no-footer"
                >
                  <div className="row">
                    <div className="col-sm-6">
                      <div
                        className="dataTables_length"
                        id="manageTable_length"
                      >
                        <label>
                          Show{" "}
                          <select
                            name="manageTable_length"
                            aria-controls="manageTable"
                            className="form-control input-sm"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
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
                      <div
                        id="manageTable_filter"
                        className="dataTables_filter"
                      >
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
                        style={{ width: 1241 }}
                      >
                        <thead>
                          <tr role="row">
                            <th style={{ width: "62.2px" }}>Invoice #</th>
                            <th style={{ width: "79.2px" }}>Company</th>
                            <th style={{ width: "397.2px" }}>Pickup</th>
                            <th style={{ width: "331.2px" }}>Delivery</th>
                            <th style={{ width: 178 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item, index) => (
                            <tr
                              role="row"
                              key={index}
                              className={index % 2 === 0 ? "even" : "odd"}
                            >
                              <td>{item.customer_orderno}</td>
                              <td>{item.company}</td>
                              <td>{item.pickup_address}</td>
                              <td>{item.delivery_address}</td>
                              <td>
                                <Link
                                  type="button"
                                  className="btn btn-info btn-xs"
                                  // onClick={() => removeFunc2(item.id)}
                                  data-id={item.id}
                                  data-toggle="modal"
                                  data-target="#removeModal2"
                                  to={`/tripsplit/${item.id}`}
                                >
                                  Split
                                </Link>
                                <Link
                                  to={`/trips/update/${item.id}`}
                                  className="btn btn-default btn-xs"
                                >
                                  <i className="fa fa-pencil" />
                                </Link>
                                <Link
                                  target="_blank"
                                  to={`https://isovia.ca/fms_api/pdf/invoice_log.php?id=${item.id}`}
                                  className="btn btn-danger btn-xs"
                                >
                                  Dispatch
                                </Link>
                                {item.tmsTriptId && (
                                  <Link
                                    to={`/tripviewer/${item.tmsTriptId}`}
                                    className="btn btn-default btn-xs"
                                  >
                                    Map
                                  </Link>
                                )}
                                <Link
                                  target="_blank"
                                  to={`https://isovia.ca/fms_api/pdf/invoice_orders.php?id=${item.id}`}
                                  className="btn btn-warning btn-xs"
                                >
                                  Invoice
                                </Link>
                                <Link
                                  to={`/trips/assign/${item.id}`}
                                  className="btn btn-success btn-xs"
                                >
                                  Logistics
                                </Link>
                                <Link
                                  to={`/trips/split/${item.id}`}
                                  className="btn btn-xs btn-warning"
                                >
                                  Split Trip
                                </Link>
                                <Link
                                  to={`/trips/add-stop/${item.id}`}
                                  className="btn btn-xs btn-info"
                                >
                                  Add Stop
                                </Link>
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
                        Showing {offset + 1} to{" "}
                        {Math.min(offset + itemsPerPage, list.length)} of{" "}
                        {list.length} entries
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
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
              {/* /.box-body */}
            </div>
            {/* /.box */}
          </div>
          {/* col-md-12 */}
        </div>
        {/* /.row */}
      </section>
    </div>
  );
};

export default Triplist;
