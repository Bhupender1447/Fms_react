import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const Trailors = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust this value to set the number of items per page
  const [update, setupdate] = useState(0);

  // OCR States
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [selectedTrailerForOcr, setSelectedTrailerForOcr] = useState(null);
  const [ocrFile, setOcrFile] = useState(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}api/fetchtrailorsProductData`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [update]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/remove`,
        new URLSearchParams({
          id: id,
          type: 'fms_trailors'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'ci_session=06vlfcjjenfs9pp507kpsbcetr7h8va3'
          }
        }
      );
      console.log("Response:", response.data);
      setupdate(update + 1)
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // OCR Logic
  const flattenObject = (obj, prefix = "", res = {}) => {
    for (let key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (typeof value === "object" && value !== null) {
        flattenObject(value, newKey, res);
      } else {
        res[newKey.toLowerCase()] = String(value);
      }
    }
    return res;
  };

  const handleOcrScan = async () => {
    if (!ocrFile) {
      toast.warning("Please select a file first");
      return;
    }

    setIsOcrLoading(true);
    setOcrResult(null);

    const ocrData = new FormData();
    ocrData.append("file", ocrFile);
    ocrData.append("module_type", "trailer");
    ocrData.append(
      "prompt",
      `Extract trailer details into strict JSON exactly matching these keys: {"owner_name":"Company/Owner Name","plate_number":"Plate number","vin_number":"VIN","trailer_type":"Trailer type","make":"Make/Brand","model":"Model","year":"Year","country":"Country","province":"Province/State","color":"Color","registered_weight":"Weight","length":"Length"}. Return ONLY JSON.`
    );

    try {
      const response = await axios.post(
        `${BASE_URL}OCRController/simple_openai_process`,
        ocrData,
        { withCredentials: true }
      );

      if (response.data.success) {
        const gptData = response.data.gpt_response?.structured_json || {};
        const ocrDataRaw = response.data.data || {};
        const flatOCR = flattenObject(ocrDataRaw);
        const flatGPT = flattenObject(gptData);
        const combinedSource = { ...flatOCR, ...flatGPT };
        const sourceKeys = Object.keys(combinedSource);

        const getMatch = (synonyms) => {
          const key = sourceKeys.find(k => synonyms.some(s => {
            const kLower = k.toLowerCase();
            const sLower = s.toLowerCase();
            return kLower === sLower || kLower === `gpt_${sLower}` || kLower.includes(sLower);
          }));
          return key ? combinedSource[key] : null;
        };

        const extracted = {
          plate_number: getMatch(['plate_number', 'plateno', 'plate', 'licence_plate', 'license_plate']) || '',
          vin_number: getMatch(['vin_number', 'vin', 'serial_number']) || '',
          trailer_type: getMatch(['trailer_type', 'trailortype', 'type']) || '',
          make: getMatch(['make', 'brand']) || '',
          model: getMatch(['model']) || '',
          year: getMatch(['year']) || '',
          registered_weight: getMatch(['registered_weight', 'weight', 'gross_weight']) || '',
          owner_name: getMatch(['owner_name', 'owner', 'company', 'name']) || '',
          country: getMatch(['country']) || 'CA',
          province: getMatch(['province', 'state']) || '',
          color: getMatch(['color', 'colour']) || '',
          length: getMatch(['length']) || '',
          weightunits: 'Kilograms',
          lengthunits: 'Feet',
          status: 'active',
          ownership_type: 'owned'
        };

        const mappedCount = Object.values(extracted).filter(v => v !== '' && v !== 'CA' && v !== 'Kilograms' && v !== 'Feet' && v !== 'active' && v !== 'owned').length;
        setOcrResult(extracted);

        if (mappedCount > 0) {
          toast.success(`OCR processed successfully. Extracted ${mappedCount} details.`);
        } else {
          toast.warning("OCR processed, but few fields were recognized. You can review and adjust below.");
        }
      } else {
        toast.error("OCR failed or no data found");
      }
    } catch (err) {
      console.error("OCR Error:", err);
      toast.error("Error processing OCR");
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleApplyOcrUpdate = async () => {
    if (!selectedTrailerForOcr || !ocrResult) return;

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    for (const key in ocrResult) {
      if (ocrResult[key] !== '' && ocrResult[key] !== null) {
        formDataToSend.append(key, ocrResult[key]);
      }
    }
    formDataToSend.append('id', selectedTrailerForOcr.id);

    try {
      await axios.post(
        `${BASE_URL}api/updatetrailors/${selectedTrailerForOcr.id}`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Trailer updated successfully with OCR data!');
      setShowOcrModal(false);
      setupdate(prev => prev + 1);
    } catch (err) {
      console.error('Error updating trailer with OCR:', err);
      toast.error('Failed to update trailer with OCR data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenInCreateForm = () => {
    if (!ocrResult) return;
    setShowOcrModal(false);
    navigate('/trailors/create', { state: { ocrData: ocrResult } });
  };

  const handleDirectCreate = async () => {
    if (!ocrResult) return;

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    for (const key in ocrResult) {
      if (ocrResult[key] !== '' && ocrResult[key] !== null) {
        formDataToSend.append(key, ocrResult[key]);
      }
    }

    try {
      await axios.post(
        `${BASE_URL}api/createtrailer`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('New trailer created successfully with OCR data!');
      setShowOcrModal(false);
      setupdate(prev => prev + 1);
    } catch (err) {
      console.error('Error creating trailer with OCR:', err);
      toast.info('Opening in full form with extracted data...');
      navigate('/trailors/create', { state: { ocrData: ocrResult } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <h1>TRAILORS</h1>
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <Link to={'/trailors/create'} className="btn btn-primary">
                <i className="fa fa-plus" /> Add Trailors
              </Link>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  setSelectedTrailerForOcr(null);
                  setOcrFile(null);
                  setOcrResult(null);
                  setShowOcrModal(true);
                }}
              >
                <i className="fa fa-magic" /> Upload OCR / Smart Scan
              </button>
            </div>
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
                              aria-label="Image: activate to sort column ascending"
                              style={{ width: "110.2px" }}
                            >
                              Image
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Name: activate to sort column ascending"
                              style={{ width: "128.2px" }}
                            >
                              Name
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Plateno: activate to sort column ascending"
                              style={{ width: "129.2px" }}
                            >
                              Plateno
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Make: activate to sort column ascending"
                              style={{ width: "104.2px" }}
                            >
                              Make
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Year: activate to sort column ascending"
                              style={{ width: "89.2px" }}
                            >
                              Year
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Country: activate to sort column ascending"
                              style={{ width: "134.2px" }}
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
                              style={{ width: "98.2px" }}
                            >
                              State
                            </th>
                            <th
                              className="sorting"
                              tabIndex={0}
                              aria-controls="manageTable"
                              rowSpan={1}
                              colSpan={1}
                              aria-label="Action: activate to sort column ascending"
                              style={{ width: 138 }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((item, index) => (
                            <tr role="row" className="odd" key={index}>
                              <td>
                                <img
                                  src={`${BASE_URL}${item.image}`}
                                  alt="FS120"
                                  className="img-circle"
                                  width={50}
                                  height={50}
                                />
                              </td>
                              <td>{item.trailor}</td>
                              <td>{item.plateno}</td>
                              <td>{item.make}</td>
                              <td>{item.year}</td>
                              <td>{item.country}</td>
                              <td>{item.state}</td>
                              <td>
                                <Link
                                  to={`/trailors/update/${item.id}`}
                                  className="btn btn-default"
                                  title="Edit Trailer"
                                  style={{ marginRight: '4px' }}
                                >
                                  <i className="fa fa-pencil" />
                                </Link>
                                <button
                                  type="button"
                                  className="btn btn-default"
                                  title="Scan & Update Trailer with OCR"
                                  style={{ marginRight: '4px' }}
                                  onClick={() => {
                                    setSelectedTrailerForOcr(item);
                                    setOcrFile(null);
                                    setOcrResult(null);
                                    setShowOcrModal(true);
                                  }}
                                >
                                  <i className="fa fa-magic text-primary" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-default"
                                  title="Delete Trailer"
                                  onClick={() => handleRemove(item.id)}
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
                        Showing {offset + 1} to {offset + currentData.length} of {data.length} entries
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
                        />
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
      {/* OCR Modal */}
      {showOcrModal && (
        <div
          className="modal fade in"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            overflowY: 'auto'
          }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <div className="modal-header" style={{ backgroundColor: '#3c8dbc', color: '#fff' }}>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowOcrModal(false)}
                  style={{ color: '#fff', opacity: 0.9 }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-magic" />
                  {selectedTrailerForOcr
                    ? `Scan & Update Trailer (${selectedTrailerForOcr.trailor || selectedTrailerForOcr.plateno || '#' + selectedTrailerForOcr.id})`
                    : "Upload Trailer Document (AI Smart Scan / OCR)"}
                </h4>
              </div>

              <div className="modal-body" style={{ padding: '20px' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>
                    Select Trailer Document (Registration, Cab Card, Insurance, etc.):
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        setOcrFile(e.target.files[0]);
                        setOcrResult(null);
                      }}
                    />
                    <span className="input-group-btn">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleOcrScan}
                        disabled={isOcrLoading || !ocrFile}
                      >
                        {isOcrLoading ? (
                          <>
                            <i className="fa fa-spinner fa-spin" /> Scanning...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-search" /> Scan Document
                          </>
                        )}
                      </button>
                    </span>
                  </div>
                  <p className="help-block" style={{ marginTop: '5px' }}>
                    Supports PDF documents or images (PNG, JPG).
                  </p>
                </div>

                {ocrResult && (
                  <div style={{ marginTop: '20px' }}>
                    <div className="alert alert-info" style={{ marginBottom: '15px' }}>
                      <i className="fa fa-check-circle" /> <strong>Extracted Trailer Details:</strong>
                      <span className="pull-right text-muted">You can review the extracted values below before applying.</span>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      <table className="table table-bordered table-striped table-hover">
                        <thead>
                          <tr className="active">
                            <th style={{ width: '35%' }}>Field</th>
                            <th>Extracted Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Plate #</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.plate_number}
                                onChange={(e) => setOcrResult({ ...ocrResult, plate_number: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>VIN #</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.vin_number}
                                onChange={(e) => setOcrResult({ ...ocrResult, vin_number: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Trailer Type</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.trailer_type}
                                onChange={(e) => setOcrResult({ ...ocrResult, trailer_type: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Make / Brand</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.make}
                                onChange={(e) => setOcrResult({ ...ocrResult, make: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Model</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.model}
                                onChange={(e) => setOcrResult({ ...ocrResult, model: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Year</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.year}
                                onChange={(e) => setOcrResult({ ...ocrResult, year: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Owner / Company Name</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.owner_name}
                                onChange={(e) => setOcrResult({ ...ocrResult, owner_name: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Country</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.country}
                                onChange={(e) => setOcrResult({ ...ocrResult, country: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Province / State</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.province}
                                onChange={(e) => setOcrResult({ ...ocrResult, province: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Registered Weight</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.registered_weight}
                                onChange={(e) => setOcrResult({ ...ocrResult, registered_weight: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Length</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.length}
                                onChange={(e) => setOcrResult({ ...ocrResult, length: e.target.value })}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Color</strong></td>
                            <td>
                              <input
                                type="text"
                                className="form-control input-sm"
                                value={ocrResult.color}
                                onChange={(e) => setOcrResult({ ...ocrResult, color: e.target.value })}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => setShowOcrModal(false)}
                >
                  Cancel
                </button>

                {ocrResult && selectedTrailerForOcr && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleApplyOcrUpdate}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa fa-spinner fa-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-check" /> Apply & Save to Trailer
                      </>
                    )}
                  </button>
                )}

                {ocrResult && !selectedTrailerForOcr && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleOpenInCreateForm}
                    >
                      <i className="fa fa-pencil" /> Open in Full Form
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleDirectCreate}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa fa-spinner fa-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-plus" /> Save & Add Trailer
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trailors;
