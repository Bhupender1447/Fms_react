import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const Orderlist = () => {
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [postedLoadOrderIds, setPostedLoadOrderIds] = useState(new Set());
  const [postingOrderId, setPostingOrderId] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}api/orderlist`)
      .then(res => setList(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}api/loadboard/loads`, { withCredentials: true })
      .then((res) => {
        const loads = Array.isArray(res.data?.data) ? res.data.data : [];
        setPostedLoadOrderIds(new Set(loads.map((load) => String(load.order_id)).filter((id) => id && id !== 'null')));
      })
      .catch(() => {
        // Keep the action usable; the API prevents duplicate posts if this lookup is unavailable.
      });
  }, []);

  const postOrderAsLoad = async (item) => {
    setPostingOrderId(item.id);
    try {
      await axios.post(`${BASE_URL}api/loadboard/loads`, { order_id: item.id }, { withCredentials: true });
      setPostedLoadOrderIds((current) => new Set([...current, String(item.id)]));
      toast.success(`Order ${item.customer_orderno || item.loadno || item.id} posted to Loadboard.`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not post this order to the Loadboard.');
    } finally {
      setPostingOrderId(null);
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const query = searchTerm.trim().toLowerCase();
  const filteredOrders = list.filter((order) => {
    const matchesSearch = !query || [
      order.customer_orderno,
      order.loadno,
      order.company,
      order.shipment_type,
      order.pickup_address,
      order.delivery_address,
      order.status,
    ].some((value) => String(value || '').toLowerCase().includes(query));
    const status = String(order.status || '').trim().toUpperCase();
    const driverId = String(order.driver_id ?? '0').trim().toLowerCase();
    const assigned = !['', '0', 'na', 'null'].includes(driverId);
    const closed = ['CANCELLED', 'CANCELED', 'CLOSED', 'DELIVERED', 'COMPLETED'].includes(status);
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'assigned' && assigned && !closed)
      || (statusFilter === 'unassigned' && !assigned && !closed)
      || (statusFilter === 'closed' && closed);
    return matchesSearch && matchesStatus;
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredOrders.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);

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
                <div className="orders-filter-panel agent-orders-filter-panel">
                  <div className="orders-search-field">
                    <label htmlFor="agent-orders-search">Search orders</label>
                    <input
                      id="agent-orders-search"
                      type="search"
                      className="form-control"
                      placeholder="Order number, company, pickup or delivery"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                    />
                  </div>
                  <div className="orders-filter-field">
                    <label htmlFor="agent-orders-status">Assignment / status</label>
                    <select id="agent-orders-status" className="form-control" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}>
                      <option value="all">All orders</option>
                      <option value="unassigned">Unassigned</option>
                      <option value="assigned">Assigned</option>
                      <option value="closed">Completed or closed</option>
                    </select>
                  </div>
                  <div className="orders-filter-field">
                    <label htmlFor="agent-orders-page-size">Rows per page</label>
                    <select id="agent-orders-page-size" className="form-control" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div className="orders-filter-actions">
                    <span className="orders-result-count" aria-live="polite">Showing {filteredOrders.length ? offset + 1 : 0}–{Math.min(offset + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders</span>
                    <button type="button" className="btn btn-default" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setCurrentPage(0); }} disabled={!searchTerm && statusFilter === 'all'}>
                      <i className="fa fa-undo" aria-hidden="true" /> Clear filters
                    </button>
                  </div>
                </div>
                <div
                  id="manageTable_wrapper"
                  className="dataTables_wrapper form-inline dt-bootstrap no-footer"
                >
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="table-responsive">
                      <table
                        id="manageTable"
                        className="table table-bordered table-striped dataTable no-footer"
                        role="grid"
                        aria-describedby="manageTable_info"
                        style={{ width: '100%', minWidth: 900 }}
                      >
                        <thead>
                          <tr role="row">
                            <th style={{ width: "55.2px" }}>Invoice #</th>
                            <th style={{ width: "75.2px" }}>Company</th>
                            <th style={{ width: "77.2px" }}>Shipment Type</th>
                            <th style={{ width: "348.2px" }}>Pickup</th>
                            <th style={{ width: "323.2px" }}>Delivery</th>
                            <th style={{ width: 230 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length === 0 && (
                            <tr><td colSpan={6} className="text-center text-muted">No orders match these filters.</td></tr>
                          )}
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
                                  to={`${BASE_URL}pdf/invoice.php?id=${item.id}`}
                                  className="btn btn-danger btn-sm"
                                >
                                  Confirmation
                                </Link>
                                <Link
                                  target="_blank"
                                  to={`${BASE_URL}pdf/invoice_log.php?id=${item.id}`}
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
                                {(() => {
                                  const orderId = String(item.id);
                                  const status = String(item.status || '').toUpperCase();
                                  const driverId = String(item.driver_id ?? '0').trim().toLowerCase();
                                  const isEligible = String(item.mode || '').toUpperCase() !== 'LOG'
                                    && ['0', '', 'na', 'null'].includes(driverId)
                                    && !['CANCELLED', 'CANCELED', 'CLOSED', 'DELIVERED'].includes(status)
                                    && Boolean(item.pickup_address && item.delivery_address);
                                  const isPosted = postedLoadOrderIds.has(orderId);
                                  return (
                                    <button
                                      type="button"
                                      className={`btn btn-xs ${isPosted ? 'btn-default' : 'btn-info'}`}
                                      onClick={() => postOrderAsLoad(item)}
                                      disabled={!isEligible || isPosted || postingOrderId === item.id}
                                      title={!isEligible ? 'This order must be unassigned and have pickup and delivery addresses.' : undefined}
                                    >
                                      <i className={`fa ${isPosted ? 'fa-check' : 'fa-exchange'}`} />{' '}
                                      {postingOrderId === item.id ? 'Posting...' : isPosted ? 'Load Posted' : 'Post Load'}
                                    </button>
                                  );
                                })()}
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
                  </div>
                  <div className="row">
                    <div className="col-sm-5">
                      <div className="dataTables_info" id="manageTable_info" role="status" aria-live="polite">
                        Showing {filteredOrders.length ? offset + 1 : 0} to {Math.min(offset + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
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
