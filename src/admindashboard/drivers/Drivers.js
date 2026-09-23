import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { BASE_URL } from '../../config';

// DocumentChecklist Component
const DocumentChecklist = ({ driverId, onClose }) => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}api/checkDocumentList?id=${driverId}`
        );

        if (response.data.status === 'success') {
          setDocumentData(response.data.data[0]);
        } else {
          setError('Failed to fetch document data');
        }
      } catch (err) {
        setError('Error fetching document data: ' + err.message);
        console.error('Error fetching document data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchDocumentData();
    }
  }, [driverId]);

  const getStatusBadge = (status) => {
    const badgeClasses = {
      expired: 'bg-danger',
      expiring: 'bg-warning',
      valid: 'bg-success',
      default: 'bg-secondary'
    };

    const className = badgeClasses[status] || badgeClasses.default;
    return (
      <span className={`badge ${className}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getDaysText = (remainingDays) => {
    if (remainingDays === 0) return 'Expired today';
    if (remainingDays === 1) return '1 day remaining';
    if (remainingDays > 1) return `${remainingDays} days remaining`;
    return 'Expired';
  };

  if (loading) {
    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Document Checklist</h4>
              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2">Loading document data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Document Checklist</h4>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            {error ? (
              <div className="alert alert-danger">
                {error}
              </div>
            ) : !documentData ? (
              <div className="alert alert-warning">
                No document data found
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">
                    {documentData.name}
                  </h5>
                  <small className="text-muted">Driver ID: {documentData.driver_id}</small>
                </div>

                {/* Documents List */}
                <div className="mt-3">
                  {documentData.documents && documentData.documents.length > 0 ? (
                    <div className="list-group">
                      {documentData.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{doc.document_type}</h6>
                            <small className="text-muted">
                              <strong>Expiry:</strong> {new Date(doc.expiry_date).toLocaleDateString()} |
                              <strong> Status:</strong> {getDaysText(doc.remaining_days)}
                            </small>
                          </div>
                          <div>
                            {getStatusBadge(doc.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      No documents found for this driver
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="card-footer bg-light mt-3">
                  <div className="row text-center">
                    <div className="col-6">
                      <small className="text-muted">
                        Total Documents: <strong>{documentData.documents?.length || 0}</strong>
                      </small>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">
                        Expired: <strong className="text-danger">
                          {documentData.documents?.filter(doc => doc.status === 'expired').length || 0}
                        </strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Drivers Component
const Drivers = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDriverForDocs, setSelectedDriverForDocs] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}api/fetchdriversProductData`)
      .then(res => setData(res.data))
      .catch(error => console.log(error));
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/remove`,
        new URLSearchParams({
          id: id,
          type: 'fms_drivers'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'ci_session=06vlfcjjenfs9pp507kpsbcetr7h8va3'
          }
        }
      );
      console.log("Response:", response.data);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

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
            <Link to={'/drivers/create'} className="btn btn-primary">
              Add Drivers
            </Link>
            <br /> <br />
            <div className="box">
              <div className="box-header">
                <div className="col-md-6 col-xs-12 pull pull-right">
                  <button id="exportButton" className="btn btn-default">
                    <span className="fa fa-file-pdf-o" /> Export to PDF
                  </button>
                  <button id="exportButtonExcl" className="btn btn-default">
                    <span className="fa fa-file-excel-o" /> Export to Excel
                  </button>
                </div>
              </div>

              {/* /.box-header */}
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
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            value={itemsPerPage}
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
                            <th style={{ width: "41.2px" }}>Image</th>
                            <th style={{ width: "69.2px" }}>FirstName</th>
                            <th style={{ width: "67.2px" }}>LastName</th>
                            <th style={{ width: "115.2px" }}>Address1</th>
                            <th style={{ width: "127.2px" }}>Address2</th>
                            <th style={{ width: "54.2px" }}>Country</th>
                            <th style={{ width: "35.2px" }}>State</th>
                            <th style={{ width: "27.2px" }}>City</th>
                            <th style={{ width: "25.2px" }}>Zip</th>
                            <th style={{ width: 294 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map(item => (
                            <tr role="row" className="odd" key={item.id}>
                              <td>
                                <img
                                  src={item.image}
                                  alt={item.fname}
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
                                <button
                                  type="button"
                                  className="btn btn-default btn-xs"
                                  onClick={() => console.log("Default Charges")}
                                  data-toggle="modal"
                                  data-target="#defaultModal"
                                >
                                  Default Charges
                                </button>{" "}
                                <button
                                  type="button"
                                  className="btn btn-primary btn-xs"
                                  onClick={() => setSelectedDriverForDocs(item.id)}
                                >
                                  Document Checklist
                                </button>{" "}
                                <button
                                  type="button"
                                  className="btn btn-success btn-xs"
                                  onClick={() => console.log("Travel Docs.")}
                                  data-toggle="modal"
                                  data-target="#travelModal"
                                >
                                  Travel Docs.
                                </button>{" "}
                                <button
                                  type="button"
                                  className="btn btn-info btn-xs"
                                  onClick={() => console.log("Payment Prof.")}
                                  data-toggle="modal"
                                  data-target="#paymentModal"
                                >
                                  Payment Prof.
                                </button>{" "}
                                <Link
                                  to={`/drivers/update/${item.id}`}
                                  className="btn btn-default btn-xs"
                                >
                                  <i className="fa fa-pencil" />
                                </Link>{" "}
                                <button
                                  type="button"
                                  className="btn btn-default btn-xs"
                                  onClick={() => handleRemove(item.id)}
                                  data-toggle="modal"
                                  data-target="#removeModal"
                                >
                                  <i className="fa fa-trash" />
                                </button>{" "}
                                <Link
                                  to={`/drivers/hos/${item.id}`}
                                  className="btn btn-warning btn-xs"
                                >
                                  View HOS
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination Footer */}
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
                      <div
                        className="dataTables_paginate paging_simple_numbers"
                        id="manageTable_paginate"
                      >
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          breakClassName={"break-me"}
                          pageCount={Math.ceil(data.length / itemsPerPage)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                          forcePage={currentPage}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Footer Section */}
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="box-footer clearfix">
                        <div className="pull-left">
                          <strong>Total Drivers:</strong> {data.length}
                        </div>
                        <div className="pull-right">
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-default btn-sm"
                              onClick={() => window.print()}
                            >
                              <i className="fa fa-print"></i> Print
                            </button>
                            <button
                              type="button"
                              className="btn btn-default btn-sm"
                              onClick={() => console.log('Export functionality')}
                            >
                              <i className="fa fa-download"></i> Export
                            </button>
                          </div>
                        </div>
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

      {/* Document Checklist Modal */}
      {selectedDriverForDocs && (
        <DocumentChecklist
          driverId={selectedDriverForDocs}
          onClose={() => setSelectedDriverForDocs(null)}
        />
      )}
    </div>
  );
}

export default Drivers;