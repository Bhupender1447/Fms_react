import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import {Link } from 'react-router-dom';

const Invoices = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/tipsfetchProductData')
      .then(res => setData(res.data))
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
  const currentItems = data.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  return (
    <div className='content-wrapper'>
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
          <li className="active">Trips</li>
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
                              aria-label="Invoice #: activate to sort column ascending"
                              style={{ width: "66.2px" }}
                            >
                              Invoice #
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Company: activate to sort column ascending"
                              style={{ width: "83.2px" }}
                            >
                              Company
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Pickup: activate to sort column ascending"
                              style={{ width: "466.2px" }}
                            >
                              Pickup
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Delivery: activate to sort column ascending"
                              style={{ width: "386.2px" }}
                            >
                              Delivery
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Action: activate to sort column ascending"
                              style={{ width: 44 }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item, index) => (
                            <tr role="row" className={index % 2 === 0 ? 'even' : 'odd'} key={index}>
                              <td>{item.customer_orderno}</td>
                              <td>{item.company}</td>
                              <td>{item.pickup_address}</td>
                              <td>{item.delivery_address}</td>
                              <td>
                                <Link
                                  target="_blank"
                                  to={`https://isovia.ca/fms_api/pdf/invoice_orders.php?id=${item.id}`}
                                  className="btn btn-success btn-xs"
                                >
                                  Invoice
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
                        Showing {offset + 1} to {Math.min(offset + itemsPerPage, data.length)} of {data.length} entries
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Invoices;
