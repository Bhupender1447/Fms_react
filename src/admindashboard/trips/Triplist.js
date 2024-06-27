import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Triplist = () => {
  const[list,setlist]=useState([])
  useEffect(()=>{
    axios.get('https://isovia.ca/fms_api/api/tipsfetchProductData')
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err))
  },[])
  console.log(list.locations)
  return (
    <div className='content-wrapper'><section className="content-header">
    <h1>
      Manage
      <small>Trips</small>
    </h1>
    <ol className="breadcrumb">
      <li>
        <a href="#">
          <i className="fa fa-dashboard" /> Home
        </a>
      </li>
      <li className="active">Orders</li>
    </ol>
  </section>

  <section className="content">
  {/* Small boxes (Stat box) */}
  <div className="row">
    <div className="col-md-12 col-xs-12">
      <div id="messages" />
      {/*    <a href="http://localhost/fms/trips/create" class="btn btn-primary">Add trips</a> */}
      {/*        <a href="" class="btn btn-success">View Motors</a> */}
      <br /> <br />
      <div className="box">
        <div className="box-header">
          <h3 className="box-title">Manage trips</h3>
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
                        style={{ width: "62.2px" }}
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
                        style={{ width: "79.2px" }}
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
                        style={{ width: "397.2px" }}
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
                        style={{ width: "331.2px" }}
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
                        style={{ width: 178 }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(list.locations)}
                    {list&&list.locations?.map((item)=>(
                      
                    <tr role="row" className="odd">
                      <td>ISV-ORD1274</td>
                      <td>Adonis Freight Inc.</td>
                      <td>
                        50.98247000000001|-113.9533779|5555 78 Ave SE, Calgary,
                        AB T2C 4M4, Canada
                      </td>
                      <td>tssews</td>
                      <td>
                        {" "}
                        <button
                          type="button"
                          className="btn btn-info btn-xs"
                          onclick="removeFunc2(257)"
                          data-id={257}
                          data-toggle="modal"
                          data-target="#removeModal2"
                        >
                          Split
                        </button>
                        <a
                          href="http://localhost/fms/trips/update/257"
                          className="btn btn-default btn-xs"
                        >
                          <i className="fa fa-pencil" />
                        </a>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_log.php?id=257"
                          className="btn btn-danger btn-xs"
                        >
                          Dispatch
                        </a>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=257"
                          className="btn btn-warning btn-xs"
                        >
                          Invoice
                        </a>
                        <a
                          href="http://localhost/fms/trips/assign/257"
                          className="btn btn-success btn-xs"
                        >
                          Logistics
                        </a>
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
                  Showing 1 to 10 of 232 entries
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
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={0}
                        tabIndex={0}
                      >
                        Previous
                      </a>
                    </li>
                    <li className="paginate_button active">
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={1}
                        tabIndex={0}
                      >
                        1
                      </a>
                    </li>
                    <li className="paginate_button ">
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={2}
                        tabIndex={0}
                      >
                        2
                      </a>
                    </li>
                    <li className="paginate_button ">
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={3}
                        tabIndex={0}
                      >
                        3
                      </a>
                    </li>
                    <li className="paginate_button ">
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={4}
                        tabIndex={0}
                      >
                        4
                      </a>
                    </li>
                    <li className="paginate_button ">
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={5}
                        tabIndex={0}
                      >
                        5
                      </a>
                    </li>
                    <li
                      className="paginate_button disabled"
                      id="manageTable_ellipsis"
                    >
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={6}
                        tabIndex={0}
                      >
                        …
                      </a>
                    </li>
                    <li className="paginate_button ">
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={7}
                        tabIndex={0}
                      >
                        24
                      </a>
                    </li>
                    <li className="paginate_button next" id="manageTable_next">
                      <a
                        href="#"
                        aria-controls="manageTable"
                        data-dt-idx={8}
                        tabIndex={0}
                      >
                        Next
                      </a>
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

export default Triplist