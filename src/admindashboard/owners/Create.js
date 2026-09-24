/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';


const Createowners = () => {
  let [message, setmessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address1: '',
    address2: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    payment_method: '',
    accountno: '',
    isCSA: '',
    otsettlement: '',
    db: '',
    remarks: '',
    company: '',
    legal: '',
    website: '',
    phone: '',
    tollfree: '',
    ext: '',
    email: '',
    fax: '',
    fastno: '',
    fastexp: '',
    // Compliance Fields
    mc_no: '',
    dot_no: '',
    ins_policy: '',
    ins_expiry: '',
    w9_document: '',
    permit_data: '',
    safety_score: '',
    // New fields from cURL
    payrolltype: 'weekly',
    currency: 'CAD',
    milerate: '',
    milerateteam: '',
    emptymilerate: '',
    emptymilerateteam: '',
    hourlyrate: '',
    percentagerate: '',
    localtax: '',
    federaltax: '',
    sinno: '',
    ltl: 'No',
    fuelsurcharge: '',
    extra: '',
    onsettlements: 'Yes',
    byorder: 'Yes',
    ddeduction: 'No',
    isdefault: 'No',
    chargename: '',
    chargecurrency: 'CAD',
    chargemode: 'Flat',
    chargeamount: '',
    appliedon: 'Weekly',
    chargeremarks: ''
  });

  // OCR Logic
  const [ocrFile, setOcrFile] = useState(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);

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

  const handleOcrUpload = async () => {
    if (!ocrFile) {
      alert("Please select a file to upload");
      return;
    }
    
    setIsOcrLoading(true);
    
    const ocrData = new FormData();
    ocrData.append("file", ocrFile);
    ocrData.append("module_type", "owner");
    ocrData.append("prompt", `Extract owner details into strict JSON exactly matching these keys: {"name":"Owner name","company":"Company Name","address1":"Address line 1","city":"City","state":"State/Province","zip":"Zip code","country":"Country","phone":"Phone","email":"Email"}. Return ONLY JSON.`);

    try {
      const response = await axios.post(
        `${BASE_URL}OCRController/simple_openai_process`,
        ocrData,
        { withCredentials: true }
      );

      if (response.data.success) {
        let matchCount = 0;
        const gptData = response.data.gpt_response?.structured_json || {};
        const ocrDataRaw = response.data.data || {};
        const flatOCR = flattenObject(ocrDataRaw);

        // --- UNIVERSAL MAPPING SOURCE GENERATION ---
        const combinedSource = { ...flatOCR };

        if (gptData.names) gptData.names.forEach((n, i) => combinedSource[`gpt_name_${i}`] = n);
        if (gptData.companies) gptData.companies.forEach((c, i) => combinedSource[`gpt_company_${i}`] = c);
        if (gptData.addresses) gptData.addresses.forEach((a, i) => combinedSource[`gpt_address_${i}`] = a);
        if (gptData.dates) Object.entries(gptData.dates).forEach(([k, v]) => combinedSource[`gpt_date_${k}`] = v);
        if (gptData.records?.[0]) {
          Object.entries(gptData.records[0]).forEach(([k, v]) => combinedSource[`rec_${k}`] = String(v));
        }

        const flatGPT = flattenObject(gptData);
        Object.entries(flatGPT).forEach(([k, v]) => {
          combinedSource[`gpt_${k}`] = String(v);
        });

        setFormData(prev => {
          const updated = { ...prev };
          const sourceKeys = Object.keys(combinedSource);

          const isFieldEmpty = (val) => {
            if (val === null || val === undefined) return true;
            const s = String(val).trim();
            if (s === "") return true;
            if (Array.isArray(val)) return val.length === 0 || (val.length === 1 && String(val[0]).trim() === "");
            return false;
          };

          const getMatch = (synonyms) => {
            const key = sourceKeys.find(k => synonyms.some(s => {
              const kLower = k.toLowerCase();
              const sLower = s.toLowerCase();
              return kLower === sLower || kLower === `gpt_${sLower}` || kLower.includes(sLower);
            }));
            return key ? combinedSource[key] : null;
          };

          // 1. Map Name & Company
          const nameVal = getMatch(['rec_name', 'gpt_name_0', 'owner_name', 'names', 'company']);
          if (nameVal && isFieldEmpty(updated.name)) {
            updated.name = String(nameVal);
            matchCount++;
          }

          const companyVal = getMatch(['rec_company', 'gpt_company_0', 'companies', 'company_name']);
          if (companyVal && isFieldEmpty(updated.company)) {
            updated.company = String(companyVal);
            matchCount++;
          }

          // 2. Map Address
          const fullAddress = getMatch(['rec_address', 'gpt_address_0', 'addresses', 'location', 'address', 'address1']);
          if (fullAddress && isFieldEmpty(updated.address1)) {
            const parts = String(fullAddress).split(',').map(s => s.trim());
            if (parts.length >= 1) updated.address1 = parts[0]; 
            if (parts.length >= 2) updated.city = parts[1];
            if (parts.length >= 3) updated.state = parts[2]; 
            if (parts.length >= 4) updated.zip = parts[3]; 
            matchCount++;
          }

          // 4. Final catch-all
          Object.keys(updated).forEach(field => {
            if (field === 'address' || field === 'name' || field === 'company' || field === 'address1') return;
            if (!isFieldEmpty(updated[field])) return;

            const val = getMatch([field]);
            if (val) {
              updated[field] = String(val);
              matchCount++;
            }
          });

          if (matchCount > 0) {
            toast.success(`OCR processed successfully. Updated ${matchCount} fields.`);
          } else {
            toast.warning("OCR processed but no matching fields found.");
          }

          return updated;
        });

      } else {
        toast.error("OCR failed or no data found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing OCR");
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleFmcsaLookup = async () => {
    const { mc_no, dot_no } = formData;
    if (!mc_no && !dot_no) {
      toast.warning("Please enter MC# or USDOT# for lookup");
      return;
    }

    try {
      const params = dot_no ? `dot=${dot_no}` : `mc=${mc_no}`;
      const response = await axios.get(`${BASE_URL}api/fmcsa_lookup?${params}`, { withCredentials: true });

      if (response.data && response.data.legal_name) {
        const data = response.data;
        setFormData(prev => ({
          ...prev,
          name: data.legal_name || prev.name,
          legal: data.legal_name || prev.legal,
          company: data.dba_name || prev.company,
          address1: data.physical_address || prev.address1,
          phone: data.phone || prev.phone,
          dot_no: data.usdot || prev.dot_no,
          mc_no: data.mc_mx_ff_numbers || prev.mc_no,
          safety_score: data.safety_rating || ""
        }));
        toast.success("✅ FMCSA Carrier Data Verified!");
      } else {
        toast.error("❌ No carrier data found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to FMCSA Lookup service");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? 'yes' : 'no') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const response = await axios.post(`${BASE_URL}api/createowners`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setmessage(response.data.message);
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <h1>
          Manage
          <small>Truck Owners</small>
        </h1>
      </section>
      {/* Main content */}
      <section className="content">
        {/* Small boxes (Stat box) */}
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />

            {/* OCR UPLOAD SECTION */}
            <div className="box box-solid" style={{ marginBottom: '10px' }}>
              <div className="box-body">
                <div className="form-group">
                  <label>Upload Document (OCR Auto-fill)</label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setOcrFile(e.target.files[0])}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <span className="input-group-btn">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleOcrUpload}
                        disabled={isOcrLoading}
                      >
                        {isOcrLoading ? (
                          <>
                            <i className="fa fa-spinner fa-spin" style={{ marginRight: "5px" }}></i>
                            Processing...
                          </>
                        ) : (
                          "Scan & Auto-fill"
                        )}
                      </button>
                    </span>
                  </div>
                  <p className="help-block">Select a PDF or Image to auto-populate form fields.</p>
                </div>
              </div>
            </div>
            {/* END OCR UPLOAD SECTION */}
            {message && <div className="alert alert-success alert-dismissible" role="alert">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              {message}
            </div>}
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Add Truck Owners</h3>
              </div>
              {/* /.box-header */}
              <form
                role="form"
                action=""
                method="post"
                encType="multipart/form-data"
              >
                <div className="box-body">
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <br />
                    <br />
                    <br />
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Enter Name"
                          autoComplete="off"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">First Line of Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address1"
                          name="address1"
                          placeholder="Enter Address"
                          autoComplete="off"
                          value={formData.address1}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Second Line of Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          name="address2"
                          placeholder="Enter Address"
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
                          <option value="US">United States</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="store">State/Province</label>
                        <select className="form-control" id="state" name="state" value={formData.state} onChange={handleChange}>
                          <option value="">Select State</option>
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
                          placeholder="Enter City"
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
                          placeholder="Enter Postal/Zip Code"
                          autoComplete="off"
                          value={formData.zip}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="store">Payment Method</label>
                        <select
                          className="form-control"
                          id="payment_method"
                          name="payment_method"
                          value={formData.payment_method}
                          onChange={handleChange}
                        >
                          <option value="">Select Payment Method</option>
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
                          <option value="EFT">EFT</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="accountno">Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="accountno"
                          name="accountno"
                          placeholder="Enter Account Number"
                          autoComplete="off"
                          value={formData.accountno}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <br />
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isCSA"
                          id="isCSA"
                          checked={formData.isCSA === 'yes'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="isCSA">
                          is CSA
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="onsettlements"
                          name="onsettlements"
                          checked={formData.onsettlements === 'Yes'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="onsettlements">
                          On Settlements
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="byorder"
                          name="byorder"
                          checked={formData.byorder === 'Yes'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="byorder">
                          By Order
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ddeduction"
                          name="ddeduction"
                          checked={formData.ddeduction === 'Yes'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="ddeduction">
                          Direct Deduction
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isdefault"
                          name="isdefault"
                          checked={formData.isdefault === 'Yes'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="isdefault">
                          Is Default
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ltl"
                          name="ltl"
                          checked={formData.ltl === 'Yes'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="ltl">
                          LTL
                        </label>
                      </div>
                    </div>

                    {/* Compliance & Authority Section */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <h4><span className="label label-danger">Compliance & Authority (FMCSA)</span></h4>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="mc_no">MC#</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            id="mc_no"
                            name="mc_no"
                            placeholder="MC Number"
                            value={formData.mc_no}
                            onChange={handleChange}
                          />
                          <span className="input-group-btn">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleFmcsaLookup}
                            >
                              Verify MC
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="dot_no">USDOT#</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            id="dot_no"
                            name="dot_no"
                            placeholder="USDOT Number"
                            value={formData.dot_no}
                            onChange={handleChange}
                          />
                          <span className="input-group-btn">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleFmcsaLookup}
                            >
                              Verify DOT
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="ins_policy">Insurance Policy#</label>
                        <input
                          type="text"
                          className="form-control"
                          id="ins_policy"
                          name="ins_policy"
                          placeholder="Policy Number"
                          value={formData.ins_policy}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="ins_expiry">Insurance Expiry</label>
                        <input
                          type="date"
                          className="form-control"
                          id="ins_expiry"
                          name="ins_expiry"
                          value={formData.ins_expiry}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Payroll and Rate Section */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <h4><span className="label label-success">Payroll & Rates</span></h4>
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="payrolltype">Payroll Type</label>
                        <select
                          className="form-control"
                          id="payrolltype"
                          name="payrolltype"
                          value={formData.payrolltype}
                          onChange={handleChange}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="twicemonthly">Twice Monthly</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="currency">Currency</label>
                        <select
                          className="form-control"
                          id="currency"
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                        >
                          <option value="CAD">CAD</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="sinno">SIN Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sinno"
                          name="sinno"
                          placeholder="Enter SIN Number"
                          autoComplete="off"
                          value={formData.sinno}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Rate Fields */}
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="milerate">Mile Rate ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="milerate"
                          name="milerate"
                          placeholder="0.00"
                          value={formData.milerate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="milerateteam">Mile Rate Team ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="milerateteam"
                          name="milerateteam"
                          placeholder="0.00"
                          value={formData.milerateteam}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="emptymilerate">Empty Mile Rate ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="emptymilerate"
                          name="emptymilerate"
                          placeholder="0.00"
                          value={formData.emptymilerate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="emptymilerateteam">Empty Mile Rate Team ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="emptymilerateteam"
                          name="emptymilerateteam"
                          placeholder="0.00"
                          value={formData.emptymilerateteam}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="hourlyrate">Hourly Rate ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="hourlyrate"
                          name="hourlyrate"
                          placeholder="0.00"
                          value={formData.hourlyrate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="percentagerate">Percentage Rate (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="percentagerate"
                          name="percentagerate"
                          placeholder="0.00"
                          value={formData.percentagerate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="localtax">Local Tax (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="localtax"
                          name="localtax"
                          placeholder="0.00"
                          value={formData.localtax}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="federaltax">Federal Tax (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="federaltax"
                          name="federaltax"
                          placeholder="0.00"
                          value={formData.federaltax}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="fuelsurcharge">Fuel Surcharge (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="fuelsurcharge"
                          name="fuelsurcharge"
                          placeholder="0.00"
                          value={formData.fuelsurcharge}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="extra">Extra Amount ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="extra"
                          name="extra"
                          placeholder="0.00"
                          value={formData.extra}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="otsettlement">OT Settlement ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="otsettlement"
                          name="otsettlement"
                          placeholder="0.00"
                          value={formData.otsettlement}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="db">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          id="db"
                          name="db"
                          value={formData.db}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Charge Information Section */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <h4><span className="label label-success">Charge Information</span></h4>
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="chargename">Charge Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="chargename"
                          name="chargename"
                          placeholder="Enter Charge Name"
                          value={formData.chargename}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="chargecurrency">Charge Currency</label>
                        <select
                          className="form-control"
                          id="chargecurrency"
                          name="chargecurrency"
                          value={formData.chargecurrency}
                          onChange={handleChange}
                        >
                          <option value="CAD">CAD</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="chargemode">Charge Mode</label>
                        <select
                          className="form-control"
                          id="chargemode"
                          name="chargemode"
                          value={formData.chargemode}
                          onChange={handleChange}
                        >
                          <option value="Flat">Flat</option>
                          <option value="Percentage">Percentage</option>
                          <option value="PerMile">Per Mile</option>
                          <option value="PerHour">Per Hour</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="chargeamount">Charge Amount ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="chargeamount"
                          name="chargeamount"
                          placeholder="0.00"
                          value={formData.chargeamount}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="appliedon">Applied On</label>
                        <select
                          className="form-control"
                          id="appliedon"
                          name="appliedon"
                          value={formData.appliedon}
                          onChange={handleChange}
                        >
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="PerTrip">Per Trip</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="chargeremarks">Charge Remarks</label>
                        <textarea
                          className="form-control"
                          id="chargeremarks"
                          name="chargeremarks"
                          placeholder="Enter charge remarks"
                          rows="3"
                          value={formData.chargeremarks}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="remarks">General Remarks</label>
                        <textarea
                          type="text"
                          className="form-control"
                          id="remarks"
                          name="remarks"
                          autoComplete="off"
                          placeholder="Enter Remarks"
                          rows="3"
                          value={formData.remarks}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-right">
                    <br />
                    <br />
                    <br />
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Company</label>
                        <input
                          type="text"
                          className="form-control"
                          id="company"
                          name="company"
                          placeholder="Enter Company Name"
                          autoComplete="off"
                          value={formData.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Legal Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="legal"
                          name="legal"
                          placeholder="Enter Company Legal Name"
                          autoComplete="off"
                          value={formData.legal}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Web Site</label>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          name="website"
                          placeholder="Enter Website"
                          autoComplete="off"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Phone #</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          name="phone"
                          placeholder="Enter Phone"
                          autoComplete="off"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Toll Free #</label>
                        <input
                          type="text"
                          className="form-control"
                          id="tollfree"
                          name="tollfree"
                          placeholder="Enter Toll Free"
                          autoComplete="off"
                          value={formData.tollfree}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Ext #</label>
                        <input
                          type="text"
                          className="form-control"
                          id="ext"
                          name="ext"
                          placeholder="Enter Ext."
                          autoComplete="off"
                          value={formData.ext}
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
                          placeholder="Email"
                          autoComplete="off"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Fax</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fax"
                          name="fax"
                          placeholder="Fax"
                          autoComplete="off"
                          value={formData.fax}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Fast #</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fastno"
                          name="fastno"
                          placeholder="Enter Fast#"
                          autoComplete="off"
                          value={formData.fastno}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <label htmlFor="store">Fast Exp Date</label>
                      <div className="input-group date" data-provide="datepicker">
                        <input
                          type="date"
                          id="fastexp"
                          name="fastexp"
                          className="form-control"
                          value={formData.fastexp}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/* /.box-body */}
            <div className="box-footer">
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Save Changes
              </button>
              <Link
                to="https://isovia.ca/fms/customers/"
                className="btn btn-warning"
              >
                Back
              </Link>
            </div>
            {/* /.box-body */}
          </div>
          {/* /.box */}
        </div>
        {/* col-md-12 */}
      </section>
    </div>

  )
}

export default Createowners