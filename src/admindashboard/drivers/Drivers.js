import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Drivers = () => {
  let[data,setdata]=useState()
  useEffect(()=>{
    axios.get('https://isovia.ca/fms_api/api/fetchdriversProductData')
    .then(res=>setdata(res.data))
    .catch(error=>console.log(error))
  },[])
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
  {/* Content Header (Page header) */}
  <section className="content-header">
    <h1>
      Manage
      <small>Drivers</small>
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
        <Link to={'/drivers/create'}
          className="btn btn-primary"
        >
          Add Drivers
        </Link>
        {/*        <a href="" class="btn btn-success">View Motors</a> */}
        <br /> <br />
        <div className="box">
          <div className="box-header">
            <div className="col-md-6 col-xs-12 pull pull-right">
              <button id="exportButton" className="btn btn-default ">
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
                    style={{ width: 1243 }}
                  >
                    <thead>
                      <tr role="row">
                        <th
                          className="sorting"
                          tabIndex={0}
                          aria-controls="manageTable"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Image: activate to sort column ascending"
                          style={{ width: "41.2px" }}
                        >
                          Image
                        </th>
                        <th
                          className="sorting"
                          tabIndex={0}
                          aria-controls="manageTable"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="FirstName: activate to sort column ascending"
                          style={{ width: "69.2px" }}
                        >
                          FirstName
                        </th>
                        <th
                          className="sorting"
                          tabIndex={0}
                          aria-controls="manageTable"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="LastName: activate to sort column ascending"
                          style={{ width: "67.2px" }}
                        >
                          LastName
                        </th>
                        <th
                          className="sorting"
                          tabIndex={0}
                          aria-controls="manageTable"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Address1: activate to sort column ascending"
                          style={{ width: "115.2px" }}
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
                          style={{ width: "127.2px" }}
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
                          style={{ width: "54.2px" }}
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
                          style={{ width: "35.2px" }}
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
                          style={{ width: "27.2px" }}
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
                          style={{ width: "25.2px" }}
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
                          style={{ width: 294 }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                     { data&&data.map(item=>(<tr role="row" className="odd">
                        <td>
                          <img
                            src={"https://isovia.ca/fms/"+item.image}
                            alt="Gurmalak"
                            className="img-circle"
                            width={50}
                            height={50}
                          />
                        </td>
                        <td>{item.fname}</td>
                        <td>{item.lname}</td>
                        <td>{item.address1}</td>
                        <td>{item.address2}</td>
                        <td>{item.country}</td>
                        <td>{item.state}</td>
                        <td>{item.city}</td>
                        <td>{item.zip}</td>
                        <td>
                          {" "}
                          <button
                            type="button"
                            className="btn btn-default btn-xs"
                            onclick="defaultFunc(10004)"
                            data-toggle="modal"
                            data-target="#defaultModal"
                          >
                            Default Charges
                          </button>{" "}
                          <button
                            type="button"
                            className="btn btn-success btn-xs"
                            onclick="travelFunc(10004)"
                            data-toggle="modal"
                            data-target="#travelModal"
                          >
                            Travel Docs.
                          </button>{" "}
                          <button
                            type="button"
                            className="btn btn-info btn-xs"
                            onclick="paymentFunc(10004)"
                            data-toggle="modal"
                            data-target="#paymentModal"
                          >
                            Payment Prof.
                          </button>
                          <a
                            href="https://isovia.ca/fms/drivers/update/10004"
                            className="btn btn-default btn-xs"
                          >
                            <i className="fa fa-pencil" />
                          </a>{" "}
                          <button
                            type="button"
                            className="btn btn-default btn-xs"
                            onclick="removeFunc(10004)"
                            data-toggle="modal"
                            data-target="#removeModal"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </td>
                      </tr>))}
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
                    Showing 1 to 1 of 1 entries
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
                      <li
                        className="paginate_button next disabled"
                        id="manageTable_next"
                      >
                        <a
                          href="#"
                          aria-controls="manageTable"
                          data-dt-idx={2}
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
  {/* /.content */}
</div>

  )
}

export default Drivers