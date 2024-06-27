import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Invoices = () => {
  const[data,setdata]=useState()
  useEffect(()=>{
axios.get('https://isovia.ca/fms_api/api/gettripsData')
.then(res=>console.log(res.data))
.catch(err=>console.log(err))
    
  },[])
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
      <li className="active">Trips</li>
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
                    <tr role="row" className="odd">
                      <td>ISV-ORD1274</td>
                      <td>Adonis Freight Inc.</td>
                      <td>
                        50.98247000000001|-113.9533779|5555 78 Ave SE, Calgary,
                        AB T2C 4M4, Canada
                      </td>
                      <td>tssews</td>
                      <td />
                    </tr>
                    <tr role="row" className="even">
                      <td>ISV_TRIP-1229</td>
                      <td>Adonis Freight Inc.</td>
                      <td>50 Royal Group Crescent</td>
                      <td>2000 Wellington Ave, Winnipeg, MB R3H 1C2, Canada</td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=256"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="odd">
                      <td>ISV_TRIP-1228</td>
                      <td>Adonis Freight Inc.</td>
                      <td>1730 Aimco Blvd, Mississauga, ON L4W 1V1, Canada</td>
                      <td>4323 Merchant Rd, Fort Wayne, IN 46818, USA</td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=255"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="even">
                      <td>ISV_TRIP-1227</td>
                      <td>Adonis Freight Inc.</td>
                      <td>1730 Aimco Blvd, Mississauga, ON L4W 1V1, Canada</td>
                      <td>760 29th Avenue SE, Minneapolis, MN 55414, USA</td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=254"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="odd">
                      <td>ISV_TRIP-1226</td>
                      <td>Adonis Freight Inc.</td>
                      <td>2051 Williams Pkwy, Brampton, ON L6S 5T3, Canada</td>
                      <td>1 Mills Cir, Ontario, CA 91764, USA</td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=253"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="even">
                      <td>ISV_TRIP-1225</td>
                      <td>Adonis Freight Inc.</td>
                      <td>50 Royal Group Crescent</td>
                      <td>
                        3330 McClellan Blvd, Anniston, AL 36201, United States
                      </td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=252"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="odd">
                      <td>ISV_TRIP-1224</td>
                      <td>Adonis Freight Inc.</td>
                      <td>Kisko Products, 50 Royal Group Crescent,</td>
                      <td>
                        3330 McClellan Blvd, Anniston, AL 36201, United States
                      </td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=251"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="even">
                      <td>ISV_TRIP-1223</td>
                      <td>Adonis Freight Inc.</td>
                      <td>
                        6200 Dixie Rd Suite 229, Mississauga, ON L5T 2E1, Canada
                      </td>
                      <td>131 E Exchange Ave, Fort Worth, TX 76164, USA</td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=250"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="odd">
                      <td>ISV_TRIP-1222</td>
                      <td>Adonis Freight Inc.</td>
                      <td>3505 Ease Pointe Drive, Zanesville, OH 43701, USA</td>
                      <td>5559 Dundas St W, Etobicoke, ON M9B 1B9, Canada</td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=249"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
                    <tr role="row" className="even">
                      <td>ISV_TRIP-1221</td>
                      <td>Adonis Freight Inc.</td>
                      <td>5559 Dundas St W, Etobicoke, ON M9B 1B9, Canada</td>
                      <td>4323 Merchant Rd, Fort Wayne, IN 46818, USA</td>
                      <td>
                        <a
                          target="_blank"
                          href="http://localhost/fms/pdf/invoice_orders.php?id=248"
                          className="btn btn-success btn-xs"
                        >
                          Invoice
                        </a>
                      </td>
                    </tr>
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

export default Invoices