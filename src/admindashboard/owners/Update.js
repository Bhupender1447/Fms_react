/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from "axios";
import { BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Updateowners = () => {
  const { id } = useParams();
  let [message] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    payment_method: "",
    accountno: "",
    OTsettlement: "",
    qb: "",
    remarks: "",
    company: "",
    legal: "",
    website: "",
    phone: "",
    tollfree: "",
    ext: "",
    email: "",
    fax: "",
    fastno: "",
    fastexp: "",
    // Compliance Fields
    mc_no: "",
    dot_no: "",
    ins_policy: "",
    ins_expiry: "",
    w9_document: "",
    permit_data: "",
    safety_score: "",
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

  useEffect(() => {
    const fetchTrailerData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/updateowner/${id}`
        );
        setFormData(response.data.product_data);
      } catch (error) {
        console.error("Error fetching trailer data:", error);
      }
    };

    fetchTrailerData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}api/updateowner/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      alert("Owners updated successfully!");
    } catch (error) {
      console.error("Error updating Owners data:", error);
      alert("Error updating Owners data.");
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
            {message && (
              <div
                className="alert alert-success alert-dismissible"
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
                {message}
              </div>
            )}
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
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="store">State/Province</label>
                        <select
                          className="form-control"
                          id="state"
                          name="state"
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
                        <label htmlFor="store">Account</label>
                        <select
                          className="form-control"
                          id="accountno"
                          name="accountno"
                          value={formData.accountno}
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
                <div class="form-group">
                <label for="store">Region</label>
                <select class="form-control" id="region" name="region">
                <option value="1.0">1.0KW</option>
                <option value="2.0">2.0KW</option>
                </select>
                </div>
                </div> */}
                    <br />
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue="CSA"
                          name="isCSA"
                          id="isCSA"
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="csa">
                          is CSA
                        </label>
                      </div>
                    </div>
                    <m />
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue="YES"
                          id="OTsettlement"
                          name="OTsettlement"
                          value={formData.OTsettlement}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="ctpat">
                          One Settlement Charge Tax
                        </label>
                      </div>
                    </div>
                    <m />
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue="YES"
                          id="qb"
                          name="qb"
                          value={formData.qb}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="pip">
                          sync to QB
                        </label>
                      </div>
                    </div>
                    <m />
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
                                    <Link
                                      className="close"
                                      data-dismiss="modal"
                                    >
                                      ×
                                    </Link>
                                    <h3>Insert link</h3>
                                  </div>
                                  <div className="modal-body">
                                    <div className="form-group">
                                      <input
                                        defaultValue="http://"
                                        className="bootstrap-wysihtml5-insert-link-url form-control"
                                        data-wysihtml5-dialog-field="to"
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
                                    <Link
                                      className="close"
                                      data-dismiss="modal"
                                    >
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
                          placeholder="Enter Stop Notes"
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
                            boxShadow:
                              "rgba(0, 0, 0, 0.075) 0px 1px 1px 0px inset",
                            borderRadius: 4,
                            width: "100%",
                            height: "auto",
                          }}
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
                          placeholder="Enter  Company Name"
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
                          placeholder="Enter  Fast#"
                          autoComplete="off"
                          value={formData.fastno}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <label htmlFor="store">Fast Exp Date</label>
                      <div
                        className="input-group date"
                        data-provide="datepicker"
                      >
                        <input
                          type="text"
                          id="fastexp"
                          name="fastexp"
                          className="form-control"
                          value={formData.fastexp}
                          onChange={handleChange}
                        />
                        <div className="input-group-addon">
                          <span className="glyphicon glyphicon-th" />
                        </div>
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
                  </div>
                </div>
              </form>
            </div>
            {/* /.box-body */}
            <div className="box-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
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
  );
};

export default Updateowners;
