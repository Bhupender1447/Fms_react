import axios from 'axios';
import React, { useState } from 'react'
import {Link } from 'react-router-dom';

const Createdrivers = () => {
  const[message,setmessage]=useState();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    employeecode: '',
    address1: '',
    address2: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    citizenship: '',
    payrate: '',
    paytype: '',
    payment_method: '',
    incorporation: '',
    accountno: '',
    remarks: '',
    company: '',
    call1: '',
    call2: '',
    phone: '',
    ext: '',
    fax: '',
    email: '',
    password: '',
    dob: '',
    hiredate: '',
    termdate: '',
    fastcardno: '',
    fastexpdate: '',
    csa: '',
    medical: '',
    documentno: '',
    issuestate: '',
    issuedate: '',
    expiarydate: '',
    qb: '',
    product_image: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange2 = async (e) => {
  const file = e.target.files[0];

  // Save file in formData
  setFormData((prevData) => ({
    ...prevData,
    product_image: file
  }));

  if (!file) return;

  // ---- OCR API Call ----
  const ocrData = new FormData();
  ocrData.append("file", file);

  try {
    const response = await axios.post(
      "https://isovia.ca/fms_api/OCRController/ocr_no_truck",
      ocrData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    const data = response.data;

    if (data.success) {
      autoFillDriverForm(data.data);   // 🔥 Auto Fill
    }

  } catch (error) {
    console.log("OCR error:", error);
  }
};



const autoFillDriverForm = (ocr) => {
  let update = {};

  /* ✅ MAIN SOURCE */
  if (ocr?.extracted) {
    const dl = ocr.extracted;

    // ---------- NAME ----------
    const fullName = (dl.name || "").trim();
    const parts = fullName.split(/\s+/);
    const fname = parts.shift() || "";
    const lname = parts.join(" ");

    // ---------- ADDRESS ----------
    const address = dl.address || "";
    const addr = address.split(",").map(s => s.trim());

    update = {
      fname,
      lname,
      dob: dl.dob || "",

      documentno: dl.license_number || "",
      issuedate: dl.issue_date || "",
      expiarydate: dl.expiry_date || "",

      address1: addr[0] || "",
      city: addr[1] || "",
      state: addr[2]?.toUpperCase() || "",
      zip: addr[3]?.toUpperCase() || "",

      gender: dl.sex || "",
      height: dl.height || "",
      company: dl.company || ""
    };
  }

  /* ✅ RAW TEXT = FALLBACK (DON’T OVERRIDE VALID DATA) */
  if (ocr?.raw_text) {
    const t = ocr.raw_text.replace(/\n/g, " ");

    if (!update.dob) {
      const m = t.match(/\b(\d{4}\/\d{2}\/\d{2})\b/);
      if (m) update.dob = m[1];
    }

    if (!update.documentno) {
      const m = t.match(/J\d{4}\s\d{5}\s\d{5}/);
      if (m) update.documentno = m[0];
    }
  }

  setFormData(prev => ({
    ...prev,
    ...update
  }));
};



const getValue = (text, key, part = 1) => {
  try {
    const line = text.split("\n").find((l) => l.includes(key));
    if (!line) return "";
    return line.split(" ").slice(part).join(" ").trim();
  } catch {
    return "";
  }
};

const extractDate = (text, label) => {
  const regex = /(\d{4}[-\/]\d{2}[-\/]\d{2})/;
  const match = text.match(regex);
  return match ? match[1] : "";
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      product_image: e.target.files[0]
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const [key, value] of Object.entries(formData)) {
      data.append(key, value);
    }

    try {
      const response = await axios.post('https://isovia.ca/fms_api/api/createdrivers', data);
      setmessage(response.data);
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>

    <div className="form-group">
  <label htmlFor="product_image">Upload Licence / PDF</label>

  <div className="input-group">
    <input
      type="file"
      id="product_image"
      name="product_image"
      accept=".png,.jpg,.jpeg,.pdf"
      className="form-control"
      onChange={(e) => setSelectedFile(e)}
    />

    <span className="input-group-btn">
      <button
        type="button"
        className="btn btn-success"
        onClick={() => handleFileChange2(selectedFile)}
      >
        Scan OCR
      </button>
    </span>
  </div>
</div>


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
      {message?.status && (
  <div 
    className={`alert alert-${message.status === 'error' ? 'danger' : 'success'} alert-dismissible`} 
    role="alert"
  >
    <button
      type="button"
      className="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">×</span>
    </button>
    {message.message || message}
  </div>
)}
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">Add Drivers</h3>
          </div>
          {/* /.box-header */}
          <form
            role="form"
           onSubmit={handleSubmit}
          >
            <div className="box-body">
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="col-md-06 col-xs-12 pull pull-left">
                  <label htmlFor="formFileSm" className="form-label">
                    Upload Image
                  </label>
                  <input
                    className="form-control form-control-sm"
                    name="product_image"
                    id="product_image"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fname"
                      name="fname"
                      autoComplete="off"
                      value={formData.fname}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lname"
                      name="lname"
                      autoComplete="off"
                      value={formData.lname}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Employee Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="employeecode"
                      name="employeecode"
                      autoComplete="off"
                      value={formData.employeecode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">First Line of Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address1"
                      name="address1"
                      autoComplete="off"
                      value={formData.address1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Second Line of Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address2"
                      name="address2"
                      autoComplete="off"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Country</label>
                    <select
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">State/Province</label>
                    <select className="form-control" id="state" name="state">
                      <option value="AB">Alberta</option>
                      <option value="BC">British Columbia</option>
                      <option value="MB">Manitoba</option>
                      <option value="NB">New Brunswick</option>
                      <option value="NF">Newfoundland</option>
                      <option value="NT">Northwest Territories</option>
                      <option value="NS">Nova Scotia</option>
                      <option value="NU">Nunavut</option>
                      <option value="ON">Ontario</option>
                      <option value="PE">Prince Edward Island</option>
                      <option value="QC">Quebec</option>
                      <option value="SK">Saskatchewan</option>
                      <option value="YT">Yukon Territory</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      autoComplete="off"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Postal/Zip code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      name="zip"
                      autoComplete="off"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Fleet</label>
                    <select
                      className="form-control"
                      id="fleet"
                      name="fleet"
                    
                    ></select>
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Citizenship</label>
                    <select
                      className="form-control"
                      id="citizenship"
                      name="citizenship"
                      value={formData.citizenship}
                      onChange={handleChange}
                    >
                      <option value="AB">Alberta</option>
                      <option value="BC">British Columbia</option>
                      <option value="MB">Manitoba</option>
                      <option value="NB">New Brunswick</option>
                      <option value="NF">Newfoundland</option>
                      <option value="NT">Northwest Territories</option>
                      <option value="NS">Nova Scotia</option>
                      <option value="NU">Nunavut</option>
                      <option value="ON">Ontario</option>
                      <option value="PE">Prince Edward Island</option>
                      <option value="QC">Quebec</option>
                      <option value="SK">Saskatchewan</option>
                      <option value="YT">Yukon Territory</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Pay Rate</label>
                    <input
                      type="text"
                      className="form-control"
                      id="payrate"
                      name="payrate"
                      autoComplete="off"
                      value={formData.payrate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Payment Type</label>
                    <select
                      className="form-control"
                      id="paytype"
                      name="paytype"
                      value={formData.paytype}
                      onChange={handleChange}
                    >
                      <option value="Flat">Flat Rate</option>
                      <option value="PPM">Pay Per Mile</option>
                      <option value="PPH">Pay per Hour</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Payment Method</label>
                    <select
                      className="form-control"
                      id="payment_method"
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleChange}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="DD">DD</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                      <option value="IMPS">IMPS</option>
                      <option value="eTransfer">eTransfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Direct Debit">Direct Debit</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                      <option value="ACH">ACH</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Account No</label>
                    <input
                      type="text"
                      className="form-control"
                      id="accountno"
                      name="accountno"
                      value={formData.accountno}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Incorporation State</label>
                    <select
                      className="form-control"
                      id="incorporation"
                      name="incorporation"
                      autoComplete="off"
                      value={formData.incorporation}
                      onChange={handleChange}
                    >
                      <option value="AB">Alberta</option>
                      <option value="BC">British Columbia</option>
                      <option value="MB">Manitoba</option>
                      <option value="NB">New Brunswick</option>
                      <option value="NF">Newfoundland</option>
                      <option value="NT">Northwest Territories</option>
                      <option value="NS">Nova Scotia</option>
                      <option value="NU">Nunavut</option>
                      <option value="ON">Ontario</option>
                      <option value="PE">Prince Edward Island</option>
                      <option value="QC">Quebec</option>
                      <option value="SK">Saskatchewan</option>
                      <option value="YT">Yukon Territory</option>
                    </select>
                  </div>
                </div>
                {/*
              <div class="col-md-4 col-xs-12 pull pull-left">
              <label for="store">Pickup Date</label>   
                  <div class="input-group date" data-provide="datepicker">
                  
                  <input type="text" class="form-control">
                      <div class="input-group-addon">
                      <span class="glyphicon glyphicon-th"></span>
                      </div>
                  </div>
              </div>
        */}
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="description">Remarks</label>
                    <ul className="wysihtml5-toolbar" style={{}}>
                      <li className="dropdown">
                        <Link
                          className="btn btn-default dropdown-toggle "
                          data-toggle="dropdown"
                        >
                          <span className="glyphicon glyphicon-font" />
                          <span className="current-font">Normal text</span>
                          <b className="caret" />
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="p"
                              tabIndex={-1}
                              to="#"
                              unselectable="on"
                            >
                              Normal text
                            </Link>
                          </li>
                          <li>
                            <Link
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h1"
                              tabIndex={-1}
                              to="#"
                              unselectable="on"
                            >
                              Heading 1
                            </Link>
                          </li>
                          <li>
                            <Link
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h2"
                              tabIndex={-1}
                              to="#"
                              unselectable="on"
                            >
                              Heading 2
                            </Link>
                          </li>
                          <li>
                            <Link
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h3"
                              tabIndex={-1}
                              to="#"
                              unselectable="on"
                            >
                              Heading 3
                            </Link>
                          </li>
                          <li>
                            <Link
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h4"
                              tabIndex={-1}
                              to="#"
                              unselectable="on"
                            >
                              Heading 4
                            </Link>
                          </li>
                          <li>
                            <Link
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h5"
                              tabIndex={-1}
                              to="#"
                              unselectable="on"
                            >
                              Heading 5
                            </Link>
                          </li>
                          <li>
                            <Link
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h6"
                              tabIndex={-1}
                              to="#"
                              unselectable="on"
                            >
                              Heading 6
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="btn-group">
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="bold"
                            title="CTRL+B"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            Bold
                          </Link>
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="italic"
                            title="CTRL+I"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            Italic
                          </Link>
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="underline"
                            title="CTRL+U"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            Underline
                          </Link>
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="small"
                            title="CTRL+S"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            Small
                          </Link>
                        </div>
                      </li>
                      <li>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="formatBlock"
                          data-wysihtml5-command-value="blockquote"
                          data-wysihtml5-display-format-name="false"
                          tabIndex={-1}
                          to="#"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-quote" />
                        </Link>
                      </li>
                      <li>
                        <div className="btn-group">
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="insertUnorderedList"
                            title="Unordered list"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-list" />
                          </Link>
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="insertOrderedList"
                            title="Ordered list"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-th-list" />
                          </Link>
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="Outdent"
                            title="Outdent"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-indent-right" />
                          </Link>
                          <Link
                            className="btn  btn-default"
                            data-wysihtml5-command="Indent"
                            title="Indent"
                            tabIndex={-1}
                            to="#"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-indent-left" />
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div
                          className="bootstrap-wysihtml5-insert-link-modal modal fade"
                          data-wysihtml5-dialog="createLink"
                        >
                          <div className="modal-dialog ">
                            <div className="modal-content">
                              <div className="modal-header">
                                <Link className="close" data-dismiss="modal">
                                  ×
                                </Link>
                                <h3>Insert link</h3>
                              </div>
                              <div className="modal-body">
                                <div className="form-group">
                                  <input
                                    defaultValue="http://"
                                    className="bootstrap-wysihtml5-insert-link-url form-control"
                                    data-wysihtml5-dialog-field="href"
                                  />
                                </div>
                                <div className="checkbox">
                                  <label>
                                    <input
                                      type="checkbox"
                                      className="bootstrap-wysihtml5-insert-link-target"
                                      defaultChecked=""
                                    />
                                    Open link in new window
                                  </label>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <Link
                                  className="btn btn-default"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="cancel"
                                  to="#"
                                >
                                  Cancel
                                </Link>
                                <Link
                                  to="#"
                                  className="btn btn-primary"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="save"
                                >
                                  Insert link
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="createLink"
                          title="Insert link"
                          tabIndex={-1}
                          to="#"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-share" />
                        </Link>
                      </li>
                      <li>
                        <div
                          className="bootstrap-wysihtml5-insert-image-modal modal fade"
                          data-wysihtml5-dialog="insertImage"
                        >
                          <div className="modal-dialog ">
                            <div className="modal-content">
                              <div className="modal-header">
                                <Link className="close" data-dismiss="modal">
                                  ×
                                </Link>
                                <h3>Insert image</h3>
                              </div>
                              <div className="modal-body">
                                <div className="form-group">
                                  <input
                                    defaultValue="http://"
                                    className="bootstrap-wysihtml5-insert-image-url form-control"
                                    data-wysihtml5-dialog-field="src"
                                  />
                                </div>
                              </div>
                              <div className="modal-footer">
                                <Link
                                  className="btn btn-default"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="cancel"
                                  to="#"
                                >
                                  Cancel
                                </Link>
                                <Link
                                  className="btn btn-primary"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="save"
                                  to="#"
                                >
                                  Insert image
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="insertImage"
                          title="Insert image"
                          tabIndex={-1}
                          to="#"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-picture" />
                        </Link>
                      </li>
                    </ul>
                    <textarea
                      type="text"
                      className="form-control"
                      id="remarks"
                      name="remarks"
                      autoComplete="off"
                      placeholder="Enter 
            Stop Notes"
                      style={{ display: "none" }}
                      value={formData.remarks}
                      onChange={handleChange}
                    />
                    <input
                      type="hidden"
                      name="_wysihtml5_mode"
                      defaultValue={1}
                    />
                    <iframe
                      className="wysihtml5-sandbox"
                      security="restricted"
                      allowTransparency="true"
                      frameBorder={0}
                      width={0}
                      height={0}
                      marginWidth={0}
                      marginHeight={0}
                      style={{
                        display: "block",
                        backgroundColor: "rgb(255, 255, 255)",
                        borderCollapse: "separate",
                        borderColor: "rgb(204, 204, 204)",
                        borderStyle: "solid",
                        borderWidth: "0.8px",
                        clear: "none",
                        float: "none",
                        margin: 0,
                        outline: "rgb(85, 85, 85) none 0px",
                        outlineOffset: 0,
                        padding: "6px 12px",
                        position: "static",
                        inset: "auto",
                        zIndex: "auto",
                        verticalAlign: "baseline",
                        textAlign: "start",
                        boxSizing: "border-box",
                        boxShadow: "rgba(0, 0, 0, 0.075) 0px 1px 1px 0px inset",
                        borderRadius: 4,
                        width: "100%",
                        height: "auto"
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-right">
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                      autoComplete="off"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Call 1*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="call1"
                      name="call1"
                      autoComplete="off"
                      value={formData.call1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Call 2</label>
                    <input
                      type="text"
                      className="form-control"
                      id="call2"
                      name="call2"
                      autoComplete="off"
                      value={formData.call2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Phone #</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      autoComplete="off"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Ext #</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ext"
                      name="ext"
                      autoComplete="off"
                      value={formData.ext}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Fax</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fax"
                      name="fax"
                      autoComplete="off"
                      value={formData.fax}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      autoComplete="off"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-xs-12 pull pull-left">
                  <label htmlFor="store">Date of birth</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      id="dob"
                      name="dob"
                      className="form-control"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                    <div className="input-group-addon">
                      <span className="glyphicon glyphicon-th" />
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-12 pull pull-left">
                  <label htmlFor="store">Hire Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      id="hiredate"
                      name="hiredate"
                      className="form-control"
                      value={formData.hiredate}
                      onChange={handleChange}
                    />
                    <div className="input-group-addon">
                      <span className="glyphicon glyphicon-th" />
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-xs-12 pull pull-left">
                  <label htmlFor="store">Term Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      id="termdate"
                      name="termdate"
                      className="form-control"
                      value={formData.termdate}
                      onChange={handleChange}
                    />
                    <div className="input-group-addon">
                      <span className="glyphicon glyphicon-th" />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Fast card #</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fastcardno"
                      name="fastcardno"
                      autoComplete="off"
                      value={formData.fastcardno}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <label htmlFor="store">Fast Expiary Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      id="fastexpdate"
                      name="fastexpdate"
                      className="form-control"
                      value={formData.fastexpdate}
                      onChange={handleChange}
                    />
                    <div className="input-group-addon">
                      <span className="glyphicon glyphicon-th" />
                    </div>
                  </div>
                </div>
                <br />
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue="YES"
                      name="csa"
                      id="csa"
                      value={formData.csa}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="csa">
                      CSA
                    </label>
                  </div>
                </div>
                <m />
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue="YES"
                      id="medical"
                      name="medical"
                      value={formData.medical}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="ctpat">
                      Medical Required
                    </label>
                  </div>
                </div>
                <m />
                <div className="col-md-3 col-xs-12 pull pull-left">
                  {/*
              <div class="col-md-4 col-xs-12 pull pull-left">
              <label for="store">Pickup Date</label>   
                  <div class="input-group date" data-provide="datepicker">
                  
                  <input type="text" class="form-control">
                      <div class="input-group-addon">
                      <span class="glyphicon glyphicon-th"></span>
                      </div>
                  </div>
              </div>
        */}
                </div>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <h4>
                      <span className="label label-success">
                        Driver Licence Details
                      </span>
                    </h4>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Document No.</label>
                    <input
                      type="text"
                      className="form-control"
                      id="documentno"
                      name="documentno"
                      autoComplete="off"
                      value={formData.documentno}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/*
                <div class="col-md-6 col-xs-12 pull pull-left">
              
                  <div class="form-group">
                  <label for="username">Issuing Authority</label>
                  <input type="text" class="form-control" id="issuingauthority" name="issuingauthority"     autocomplete="off">
                  </div>
              
              </div>
              
              */}
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Issuing Country</label>
                    <select
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Issuing State/Province</label>
                    <select
                      className="form-control"
                      id="issuestate"
                      name="issuestate"
                      value={formData.issuestate}
                      onChange={handleChange}
                    >
                      <option value="Alberta">Alberta</option>
                      <option value="British Columbia">British Columbia</option>
                      <option value="Manitoba">Manitoba</option>
                      <option value="New Brunswick">New Brunswick</option>
                      <option value="Newfoundland">Newfoundland</option>
                      <option value="Northwest Territories">
                        Northwest Territories
                      </option>
                      <option value="Nova Scotia">Nova Scotia</option>
                      <option value="Nunavut">Nunavut</option>
                      <option value="Ontario">Ontario</option>
                      <option value="Prince Edward Island">
                        Prince Edward Island
                      </option>
                      <option value="Quebec">Quebec</option>
                      <option value="Saskatchewan">Saskatchewan</option>
                      <option value="Yukon Territory">Yukon Territory</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <label htmlFor="store">Issue Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      id="issuedate"
                      name="issuedate"
                      className="form-control"
                      value={formData.issuedate}
                      onChange={handleChange}
                    />
                    <div className="input-group-addon">
                      <span className="glyphicon glyphicon-th" />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <label htmlFor="store">Expiry Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      id="expiarydate"
                      name="expiarydate"
                      className="form-control"
                      value={formData.expiarydate}
                      onChange={handleChange}
                    />
                    <div className="input-group-addon">
                      <span className="glyphicon glyphicon-th" />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <h4>
                      <span className="label label-success">
                        Medical Detail
                      </span>
                    </h4>
                  </div>
                </div>
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <label htmlFor="store">Expiry Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      id="expiarydate"
                      name="expiarydate"
                      className="form-control"
                      value={formData.expiarydate}
                      onChange={handleChange}
                    />
                    <div className="input-group-addon">
                      <span className="glyphicon glyphicon-th" />
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <br />
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue="YES"
                      name="qb"
                      id="qb"
                      value={formData.qb}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="csa">
                      Sync to QB
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* /.box-body */}
            <div className="box-footer">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <Link
                to="https://isovia.ca/fms/customers/"
                className="btn btn-warning"
              >
                Back
              </Link>
            </div>
          </form>
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

export default Createdrivers