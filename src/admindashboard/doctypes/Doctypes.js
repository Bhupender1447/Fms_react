import React from 'react'
import { Link } from 'react-router-dom'

const Doctypes = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Documents Type</small>
      </h1>
      <ol className="breadcrumb">
        <li>
          <a href="#">
            <i className="fa fa-dashboard" /> Home
          </a>
        </li>
        <li className="active">Documents</li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div id="messages" />
          <Link
            to="/doctypes/create"
            className="btn btn-primary"
          >
            Add Documents
          </Link>
          {/*        <a href="" class="btn btn-success">View Motors</a> */}
          <br /> <br />
          <div className="box">
            <div className="col-md-6 col-xs-12 pull pull-right">
              <button id="exportButton" className="btn btn-default ">
                <span className="fa fa-file-pdf-o" /> Export to PDF
              </button>
              <button id="exportButtonExcl" className="btn btn-default">
                <span className="fa fa-file-excel-o" /> Export to Excel
              </button>
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
                            aria-label="Name: activate to sort column ascending"
                            style={{ width: "168.2px" }}
                          >
                            Name
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Module: activate to sort column ascending"
                            style={{ width: "475.2px" }}
                          >
                            Module
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Remarks: activate to sort column ascending"
                            style={{ width: "225.2px" }}
                          >
                            Remarks
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Action: activate to sort column ascending"
                            style={{ width: 216 }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr role="row" className="odd">
                          <td>test</td>
                          <td>-Employee-Driver-Customer</td>
                          <td>
                            <p>test</p>
                          </td>
                          <td>
                            <a
                              href="http://localhost/fms/doctypes/update/8"
                              className="btn btn-default"
                            >
                              <i className="fa fa-pencil" />
                            </a>{" "}
                            <button
                              type="button"
                              className="btn btn-default"
                              onclick="removeFunc(8)"
                              data-toggle="modal"
                              data-target="#removeModal"
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                        <tr role="row" className="even">
                          <td>test</td>
                          <td>-Employee-Driver-Customer</td>
                          <td>
                            <p>test</p>
                          </td>
                          <td>
                            <a
                              href="http://localhost/fms/doctypes/update/7"
                              className="btn btn-default"
                            >
                              <i className="fa fa-pencil" />
                            </a>{" "}
                            <button
                              type="button"
                              className="btn btn-default"
                              onclick="removeFunc(7)"
                              data-toggle="modal"
                              data-target="#removeModal"
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                        <tr role="row" className="odd">
                          <td>test</td>
                          <td>-Employee-Driver-Customer</td>
                          <td>
                            <p>test</p>
                          </td>
                          <td>
                            <a
                              href="http://localhost/fms/doctypes/update/6"
                              className="btn btn-default"
                            >
                              <i className="fa fa-pencil" />
                            </a>{" "}
                            <button
                              type="button"
                              className="btn btn-default"
                              onclick="removeFunc(6)"
                              data-toggle="modal"
                              data-target="#removeModal"
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                        <tr role="row" className="even">
                          <td>test</td>
                          <td>Customer</td>
                          <td>
                            <p>test</p>
                          </td>
                          <td>
                            <a
                              href="http://localhost/fms/doctypes/update/3"
                              className="btn btn-default"
                            >
                              <i className="fa fa-pencil" />
                            </a>{" "}
                            <button
                              type="button"
                              className="btn btn-default"
                              onclick="removeFunc(3)"
                              data-toggle="modal"
                              data-target="#removeModal"
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                        <tr role="row" className="odd">
                          <td>test</td>
                          <td>Customer</td>
                          <td>
                            <p>test</p>
                          </td>
                          <td>
                            <a
                              href="http://localhost/fms/doctypes/update/2"
                              className="btn btn-default"
                            >
                              <i className="fa fa-pencil" />
                            </a>{" "}
                            <button
                              type="button"
                              className="btn btn-default"
                              onclick="removeFunc(2)"
                              data-toggle="modal"
                              data-target="#removeModal"
                            >
                              <i className="fa fa-trash" />
                            </button>
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
                      Showing 1 to 5 of 5 entries
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

export default Doctypes