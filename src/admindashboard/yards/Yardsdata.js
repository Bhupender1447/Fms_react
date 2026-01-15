import {Link } from 'react-router-dom';

const Yardsdata = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Yards</small>
      </h1>
    </section>
    <section className="content">
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div id="messages" />
          <Link to="/yards/create" className="btn btn-primary">
            Add yards
          </Link>
          {/*        <Link to="" class="btn btn-success">View Motors</Link> */}
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
                            aria-label="Location: activate to sort column ascending"
                            style={{ width: "520.2px" }}
                          >
                            Location
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Address1: activate to sort column ascending"
                            style={{ width: "321.2px" }}
                          >
                            Address1
                          </th>
                          <th
                            className="sorting"
                            tabIndex={0}
                            aria-controls="manageTable"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="City: activate to sort column ascending"
                            style={{ width: "55.2px" }}
                          >
                            City
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
                            aria-label="Zip: activate to sort column ascending"
                            style={{ width: "32.2px" }}
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
                            style={{ width: 45 }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr role="row" className="odd">
                          <td>
                            Toronto Pearson International Airport (YYZ), Silver
                            Dart Drive, Mississauga, ON, Canada
                          </td>
                          <td>
                            6301 Silver Dart Dr, Mississauga, ON L5P 1B2, Canada
                          </td>
                          <td>Mississauga</td>
                          <td>Ontario</td>
                          <td>L5P 1B2</td>
                          <td>
                            <Link
                              to="/yards/update/8"
                              className="btn btn-default btn-sm"
                            >
                              <i className="fa fa-pencil" />
                            </Link>{" "}
                            <button
                              type="button"
                              className="btn btn-default btn-sm"
                              onclick="removeFunc(8)"
                              data-toggle="modal"
                              data-target="#removeModal"
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                        <tr role="row" className="even">
                          <td>
                            Brampton Civic Hospital Entrance A, Bovaird Drive
                            East, Brampton, ON, Canada
                          </td>
                          <td>2100 Bovaird Dr E, Brampton, ON L6R 3J7, Canada</td>
                          <td>Brampton</td>
                          <td>Ontario</td>
                          <td>L6R 3J7</td>
                          <td>
                            <Link
                              to="/yards/update/7"
                              className="btn btn-default btn-sm"
                            >
                              <i className="fa fa-pencil" />
                            </Link>{" "}
                            <button
                              type="button"
                              className="btn btn-default btn-sm"
                              onclick="removeFunc(7)"
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
                      Showing 1 to 2 of 2 entries
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
    {/* /.content */}
  </div>
  
  )
}

export default Yardsdata