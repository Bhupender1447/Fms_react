import React from 'react'
import { Link } from 'react-router-dom'

const Importers = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Importers</small>
      </h1>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div id="messages" />
          <Link
            to="/importers/create"
            className="btn btn-primary"
          >
            Add Importers
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
                      style={{ width: 1240 }}
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
                            style={{ width: "117.2px" }}
                          >
                            Name
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Company: activate to sort column ascending"
                            style={{ width: "169.2px" }}
                          >
                            Company
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Phone: activate to sort column ascending"
                            style={{ width: "127.2px" }}
                          >
                            Phone
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Ext: activate to sort column ascending"
                            style={{ width: "84.2px" }}
                          >
                            Ext
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Fax: activate to sort column ascending"
                            style={{ width: "89.2px" }}
                          >
                            Fax
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="CSA: activate to sort column ascending"
                            style={{ width: "100.2px" }}
                          >
                            CSA
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="FAST: activate to sort column ascending"
                            style={{ width: "113.2px" }}
                          >
                            FAST
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
                        <tr role="row" className="odd">
                          <td>test</td>
                          <td>test</td>
                          <td>e</td>
                          <td>e</td>
                          <td />
                          <td>YES</td>
                          <td>YES</td>
                          <td>
                            <a
                              href="http://localhost/fms/importers/update/1"
                              className="btn btn-default btn-sm"
                            >
                              <i className="fa fa-pencil" />
                            </a>{" "}
                            <button
                              type="button"
                              className="btn btn-default btn-sm"
                              onclick="removeFunc(1)"
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

export default Importers