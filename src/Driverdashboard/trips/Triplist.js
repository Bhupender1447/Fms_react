import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../config'

const TripDriverlist = () => {
  const [list, setList] = useState([])

  useEffect(() => {
    let { id } = JSON.parse(localStorage.getItem('logindetail'))
    axios.get(`${BASE_URL}api/tipsdriverfetchProductData/${id}`)
      .then(res => setList(res.data))
      .catch(err => console.log(err))
  }, [])
  console.log(list)
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
                <div id="manageTable_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="dataTables_length" id="manageTable_length">
                        <label>
                          Show{" "}
                          <select
                            name="manageTable_length"
                            aria-controls="manageTable"
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
                            <th style={{ width: "62.2px" }}>Invoice #</th>
                            <th style={{ width: "79.2px" }}>Company</th>
                            <th style={{ width: "397.2px" }}>Pickup</th>
                            <th style={{ width: "331.2px" }}>Delivery</th>
                            <th style={{ width: 178 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list && list.map((item, index) => (
                            <tr role="row" key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                              <td>{item.customer_orderno}</td>
                              <td>{item.company}</td>
                              <td>{item.pickup_address}</td>
                              <td>{item.delivery_address}</td>
                              <td>
                                {/* Trip status badge */}
                                {item.status && (
                                  <span className="badge-status" style={{
                                    marginBottom: 4,
                                    background:
                                      item.status === 'COMPLETED'   ? '#ecfdf5' :
                                      item.status === 'IN_PROGRESS' ? '#eff6ff' :
                                      item.status === 'PAUSED'      ? '#fffbeb' :
                                      item.status === 'CANCELLED'   ? '#fef2f2' : '#f1f5f9',
                                    color:
                                      item.status === 'COMPLETED'   ? '#065f46' :
                                      item.status === 'IN_PROGRESS' ? '#1e40af' :
                                      item.status === 'PAUSED'      ? '#92400e' :
                                      item.status === 'CANCELLED'   ? '#991b1b' : '#475569',
                                    border: `1px solid ${
                                      item.status === 'COMPLETED'   ? '#a7f3d0' :
                                      item.status === 'IN_PROGRESS' ? '#bfdbfe' :
                                      item.status === 'PAUSED'      ? '#fde68a' :
                                      item.status === 'CANCELLED'   ? '#fecaca' : '#cbd5e1'
                                    }`,
                                  }}>
                                    <span style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      backgroundColor:
                                        item.status === 'COMPLETED'   ? '#10b981' :
                                        item.status === 'IN_PROGRESS' ? '#3b82f6' :
                                        item.status === 'PAUSED'      ? '#f59e0b' :
                                        item.status === 'CANCELLED'   ? '#ef4444' : '#64748b'
                                    }} />
                                    {item.status}
                                  </span>
                                )}

                                <Link
                                  target="_blank"
                                  to={`${BASE_URL}pdf/invoice_log.php?id=${item.id}`}
                                  className="btn btn-danger btn-xs"
                                >
                                  Dispatch
                                </Link>
                                <Link
                                  target="_blank"
                                  to={`${BASE_URL}pdf/invoice_orders.php?id=${item.id}`}
                                  className="btn btn-warning btn-xs"
                                >
                                  Invoice
                                </Link>

                                {/* Update Status — only for non-terminal trips */}
                                {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && item.tmsTriptId && (
                                  <Link
                                    to={`/tripstatus/${item.tmsTriptId}`}
                                    className="btn btn-success btn-xs"
                                  >
                                    <i className="fa fa-refresh" /> Update Status
                                  </Link>
                                )}
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
                        {/* Showing 1 to 10 of {list.length} entries */}
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <div className="dataTables_paginate paging_simple_numbers" id="manageTable_paginate">
                        <ul className="pagination">
                          <li className="paginate_button previous disabled" id="manageTable_previous">
                            <Link to="#" aria-controls="manageTable" data-dt-idx={0} tabIndex={0}>Previous</Link>
                          </li>
                          {/* Pagination buttons */}
                          <li className="paginate_button next" id="manageTable_next">
                            <Link to="#" aria-controls="manageTable" data-dt-idx={8} tabIndex={0}>Next</Link>
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
    </div>
  )
}

export default TripDriverlist
