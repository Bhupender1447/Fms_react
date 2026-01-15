import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Orderlist = () => {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/orderlist')
      .then(res => setList(res.data))
      .catch(err => console.log(err));
  }, []);

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
    <div className='content-wrapper'>
      <section className="content-header">
        <h1>
          Manage
          <small>orders</small>
        </h1>
        <ol className="breadcrumb">
          <li><Link to="#"><i className="fa fa-dashboard"></i> Home</Link></li>
          <li className="active">Orders</li>
        </ol>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link to={"/createorder"} className="btn btn-primary">
              Add orders
            </Link>
            <br /> <br />
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Manage Orders</h3>
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
                        style={{ width: 1241 }}
                      >
                        <thead>
                          <tr role="row">
                            <th style={{ width: "55.2px" }}>Invoice #</th>
                            <th style={{ width: "75.2px" }}>Company</th>
                            <th style={{ width: "77.2px" }}>Shipment Type</th>
                            <th style={{ width: "348.2px" }}>Pickup</th>
                            <th style={{ width: "323.2px" }}>Delivery</th>
                            <th style={{ width: 130 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item, index) => (
                            <tr role="row" className={index % 2 === 0 ? 'even' : 'odd'} key={index}>
                              <td>{item.customer_orderno}</td>
                              <td>{item.company}</td>
                              <td>{item.shipment_type}</td>
                              <td>{item.pickup_address}</td>
                              <td>{item.delivery_address}</td>
                              <td>
                                <Link
                                  target="_blank"
                                  to={`https://isovia.ca/fms_api/pdf/invoice.php?id=${item.id}`}
                                  className="btn btn-danger btn-sm"
                                >
                                  Confirmation
                                </Link>
                                <Link
                                  target="_blank"
                                  to={`https://isovia.ca/fms_api/pdf/invoice_log.php?id=${item.id}`}
                                  className="btn btn-warning btn-xs"
                                >
                                  Invoice
                                </Link>
                                <Link
                                  to={"/agentupdate/"+item.id}
                                  className="btn btn-default btn-sm"
                                >
                                  <i className="fa fa-pencil" />
                                </Link>
                                <Link
                                  to={"/assign/"+item.id}
                                  className="btn btn-success btn-sm"
                                >
                                  Assign
                                </Link>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => console.log('removeFunc', item.id)}
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
                      <div className="dataTables_info" id="manageTable_info" role="status" aria-live="polite">
                        Showing {offset + 1} to {Math.min(offset + itemsPerPage, list.length)} of {list.length} entries
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
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
}

export default Orderlist;
