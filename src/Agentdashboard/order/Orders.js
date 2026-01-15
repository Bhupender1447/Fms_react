import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Orders = () => {
  const[list,setlist]=useState([])
  useEffect(()=>{
    axios.get('https://isovia.ca/fms_api/api/orderlist')
    .then(res=>setlist(res.data))
    .catch(err=>console.log(err))
  },[])
  return (
    <div className='content-wrapper'><section className="content-header">
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
  {/* Small boxes (Stat box) */}
  <div className="row">
    <div className="col-md-12 col-xs-12">
      <div id="messages" />
      <Link to={"/createorder"} className="btn btn-primary">
        Add orders
      </Link>
      {/*        <Link to="" className="btn btn-success">View Motors</Link> */}
      <br /> <br />
      <div className="box">
        <div className="box-header">
          <h3 className="box-title">Manage Orders</h3>
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
                      <th
                        className="sorting"
                        tabIndex={0}
                        aria-controls="manageTable"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Invoice #: activate to sort column ascending"
                        style={{ width: "55.2px" }}
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
                        style={{ width: "75.2px" }}
                      >
                        Company
                      </th>
                      <th
                        className="sorting"
                        tabIndex={0}
                        aria-controls="manageTable"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Shipment Type: activate to sort column ascending"
                        style={{ width: "77.2px" }}
                      >
                        Shipment Type
                      </th>
                      <th
                        className="sorting"
                        tabIndex={0}
                        aria-controls="manageTable"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Pickup: activate to sort column ascending"
                        style={{ width: "348.2px" }}
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
                        style={{ width: "323.2px" }}
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
                        style={{ width: 130 }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {list&&list.map(item=>(
                    <tr role="row" className="even">
                      <td>{item.customer_orderno}</td>
                      <td>{item.company}</td>
                      <td>{item.shipment_type}</td>
                      <td>
                       {item.pickup_address}
                      </td>
                      <td>
                       {item.delivery_address}
                      </td>
                      <td>
                        <Link
                          target="_blank"
                          to="/pdf/invoice.php?id=30"
                          className="btn btn-danger btn-sm"
                        >
                          Confirmation
                        </Link>
                        <Link
                          target="_blank"
                          to="/pdf/invoice_orders.php?id=30"
                          className="btn btn-warning btn-xs"
                        >
                          Invoice
                        </Link>
                        <Link
                          to={"/update/"+item.id}
                          className="btn btn-default btn-sm"
                        >
                          <i className="fa fa-pencil" />
                        </Link>
                        <Link
                          to={"/assign/"+item.id}
                          className="btn btn-success btn-sm"
                        >
                          Assign
                        </Link>{" "}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onclick="removeFunc(30)"
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
                  Showing 1 to 7 of 7 entries
                </div>
              </div>
              <div className="col-sm-7">
                <div
                  className="dataTables_paginate paging_simple_numbers"
                  id="manageTable_paginate"
                >
                  <ul className="pagination">
                    <li
                      className="paginate_button previous disabled"
                      id="manageTable_previous"
                    >
                      <Link
                        to="#"
                        aria-controls="manageTable"
                        data-dt-idx={0}
                        tabIndex={0}
                      >
                        Previous
                      </Link>
                    </li>
                    <li className="paginate_button active">
                      <Link
                        to="#"
                        aria-controls="manageTable"
                        data-dt-idx={1}
                        tabIndex={0}
                      >
                        1
                      </Link>
                    </li>
                    <li
                      className="paginate_button next disabled"
                      id="manageTable_next"
                    >
                      <Link
                        to="#"
                        aria-controls="manageTable"
                        data-dt-idx={2}
                        tabIndex={0}
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

export default Orders