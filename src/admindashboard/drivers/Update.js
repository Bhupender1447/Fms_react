/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';

const Updatedrivers = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const { id } = useParams();

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
    fleet: '',
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
    medicalexpiry: '',
    csa: '',
    medical: '',
    documentno: '',
    issuingauthority: '',
    issuingcountry: '',
    issuestate: '',
    issuedate: '',
    expiarydate: '',
    qb: '',
    product_image: null,
  });

  // Fetch driver data on component mount
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await axios.get(`https://isovia.ca/fms_api/api/updatedrivers/${id}`);
        if (response.data.product_data) {
          const data = response.data.product_data;
          setFormData({
            fname: data.fname || '',
            lname: data.lname || '',
            employeecode: data.employeecode || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
            country: data.country || 'CA',
            state: data.state || '',
            city: data.city || '',
            zip: data.zip || '',
            fleet: data.fleet || '',
            citizenship: data.citizenship || '',
            payrate: data.payrate || '',
            paytype: data.paytype || '',
            payment_method: data.payment_method || '',
            incorporation: data.incorporation || '',
            accountno: data.accountno || '',
            remarks: data.remarks || '',
            company: data.company || '',
            call1: data.call1 || '',
            call2: data.call2 || '',
            phone: data.phone || '',
            ext: data.ext || '',
            fax: data.fax || '',
            email: data.email || '',
            password: data.password || '',
            dob: data.dob || '',
            hiredate: data.hiredate || '',
            termdate: data.termdate || '',
            fastcardno: data.fastcardno || '',
            fastexpdate: data.fastexpdate || '',
            medicalexpiry: data.medicalexpiry || '',
            csa: data.csa || '',
            medical: data.medical || '',
            documentno: data.documentno || '',
            issuingauthority: data.issuingauthority || '',
            issuingcountry: data.issuingcountry || 'CA',
            issuestate: data.issuestate || '',
            issuedate: data.issuedate || '',
            expiarydate: data.expiarydate || '',
            qb: data.qb || '',
            product_image: data.product_image || null,
          });
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
        setMessage('Error fetching driver data');
      }
    };

    fetchDriverData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 'YES' : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Append all form data fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Append file if selected
    if (file) {
      formDataToSend.append('product_image', file);
    }
    
    try {
      const response = await axios.post(
        `https://isovia.ca/fms_api/api/updatedrivers/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Update successful:', response.data);
      setMessage('Driver updated successfully!');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('Error updating driver:', error);
      setMessage('Error updating driver. Please try again.');
      
      // Scroll to top to show error message
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header */}
      <section className="content-header">
        <h1>
          Manage
          <small>Drivers</small>
        </h1>
      </section>

      {/* Main Content */}
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            {/* Messages */}
            {message && (
              <div className="alert alert-success alert-dismissible" role="alert">
                <button
                  type="button"
                  className="close"
                  onClick={() => setMessage('')}
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
                {message}
              </div>
            )}

            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Edit Driver</h3>
              </div>

              {/* Form */}
              <form role="form" onSubmit={handleSubmit}>
                <div className="box-body">
                  {/* Left Column */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    
                    {/* Image Upload */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="product_image">Driver Photo</label>
                        <input
                          className="form-control"
                          name="product_image"
                          id="product_image"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="fname">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fname"
                          name="fname"
                          value={formData.fname}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="lname">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lname"
                          name="lname"
                          value={formData.lname}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="employeecode">Employee Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="employeecode"
                          name="employeecode"
                          value={formData.employeecode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="address1">Address Line 1 *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address1"
                          name="address1"
                          value={formData.address1}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="address2">Address Line 2</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          name="address2"
                          value={formData.address2}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="country">Country</label>
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
                        <label htmlFor="state">State/Province *</label>
                        <select
                          className="form-control"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select State/Province</option>
                          <option value="AB">Alberta</option>
                          <option value="BC">British Columbia</option>
                          <option value="MB">Manitoba</option>
                          <option value="NB">New Brunswick</option>
                          <option value="NL">Newfoundland and Labrador</option>
                          <option value="NT">Northwest Territories</option>
                          <option value="NS">Nova Scotia</option>
                          <option value="NU">Nunavut</option>
                          <option value="ON">Ontario</option>
                          <option value="PE">Prince Edward Island</option>
                          <option value="QC">Quebec</option>
                          <option value="SK">Saskatchewan</option>
                          <option value="YT">Yukon</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="zip">Postal/Zip Code *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="fleet">Fleet</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fleet"
                          name="fleet"
                          value={formData.fleet}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="citizenship">Citizenship</label>
                        <select
                          className="form-control"
                          id="citizenship"
                          name="citizenship"
                          value={formData.citizenship}
                          onChange={handleChange}
                        >
                          <option value="">Select Citizenship</option>
                          <option value="CA">Canadian</option>
                          <option value="US">American</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="payrate">Pay Rate ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="payrate"
                          name="payrate"
                          value={formData.payrate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="paytype">Payment Type</label>
                        <select
                          className="form-control"
                          id="paytype"
                          name="paytype"
                          value={formData.paytype}
                          onChange={handleChange}
                        >
                          <option value="">Select Type</option>
                          <option value="Flat">Flat Rate</option>
                          <option value="PPM">Pay Per Mile</option>
                          <option value="PPH">Pay per Hour</option>
                          <option value="Percentage">Percentage</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="payment_method">Payment Method</label>
                        <select
                          className="form-control"
                          id="payment_method"
                          name="payment_method"
                          value={formData.payment_method}
                          onChange={handleChange}
                        >
                          <option value="">Select Method</option>
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                          <option value="DD">Direct Deposit</option>
                          <option value="eTransfer">eTransfer</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Wire Transfer">Wire Transfer</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="incorporation">Incorporation</label>
                        <input
                          type="text"
                          className="form-control"
                          id="incorporation"
                          name="incorporation"
                          value={formData.incorporation}
                          onChange={handleChange}
                        />
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
                          value={formData.accountno}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="remarks">Remarks</label>
                        <textarea
                          className="form-control"
                          id="remarks"
                          name="remarks"
                          rows="3"
                          value={formData.remarks}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="col-md-6 col-xs-12 pull pull-right">
                    
                    {/* Company Information */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input
                          type="text"
                          className="form-control"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="call1">Primary Phone *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="call1"
                          name="call1"
                          value={formData.call1}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="call2">Secondary Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          id="call2"
                          name="call2"
                          value={formData.call2}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="ext">Extension</label>
                        <input
                          type="text"
                          className="form-control"
                          id="ext"
                          name="ext"
                          value={formData.ext}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="fax">Fax</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fax"
                          name="fax"
                          value={formData.fax}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          id="dob"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="hiredate">Hire Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="hiredate"
                          name="hiredate"
                          value={formData.hiredate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="termdate">Termination Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="termdate"
                          name="termdate"
                          value={formData.termdate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* FAST Card */}
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="fastcardno">FAST Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fastcardno"
                          name="fastcardno"
                          value={formData.fastcardno}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="fastexpdate">FAST Expiry Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="fastexpdate"
                          name="fastexpdate"
                          value={formData.fastexpdate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="csa"
                          name="csa"
                          checked={formData.csa === 'YES'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="csa">
                          CSA Certified
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="medical"
                          name="medical"
                          checked={formData.medical === 'YES'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="medical">
                          Medical Required
                        </label>
                      </div>
                    </div>

                    {/* Medical Expiry */}
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="medicalexpiry">Medical Expiry Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="medicalexpiry"
                          name="medicalexpiry"
                          value={formData.medicalexpiry}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Driver License Section */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <h4>
                          <span className="label label-success">
                            Driver License Details
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="documentno">License Number *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="documentno"
                          name="documentno"
                          value={formData.documentno}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="issuingauthority">Issuing Authority</label>
                        <input
                          type="text"
                          className="form-control"
                          id="issuingauthority"
                          name="issuingauthority"
                          value={formData.issuingauthority}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="issuingcountry">Issuing Country</label>
                        <select
                          className="form-control"
                          id="issuingcountry"
                          name="issuingcountry"
                          value={formData.issuingcountry}
                          onChange={handleChange}
                        >
                          <option value="CA">Canada</option>
                          <option value="US">United States</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="issuestate">Issuing State/Province</label>
                        <select
                          className="form-control"
                          id="issuestate"
                          name="issuestate"
                          value={formData.issuestate}
                          onChange={handleChange}
                        >
                          <option value="">Select State/Province</option>
                          <option value="AB">Alberta</option>
                          <option value="BC">British Columbia</option>
                          <option value="MB">Manitoba</option>
                          <option value="NB">New Brunswick</option>
                          <option value="NL">Newfoundland and Labrador</option>
                          <option value="NT">Northwest Territories</option>
                          <option value="NS">Nova Scotia</option>
                          <option value="NU">Nunavut</option>
                          <option value="ON">Ontario</option>
                          <option value="PE">Prince Edward Island</option>
                          <option value="QC">Quebec</option>
                          <option value="SK">Saskatchewan</option>
                          <option value="YT">Yukon</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="issuedate">Issue Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="issuedate"
                          name="issuedate"
                          value={formData.issuedate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="expiarydate">Expiry Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="expiarydate"
                          name="expiarydate"
                          value={formData.expiarydate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* QuickBooks Sync */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="qb"
                          name="qb"
                          checked={formData.qb === 'YES'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="qb">
                          Sync to QuickBooks
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Form Actions */}
                <div className="box-footer">
                  <button type="submit" className="btn btn-primary">
                    Update Driver
                  </button>
                  <Link
                    to="https://isovia.ca/fms/drivers/"
                    className="btn btn-warning ml-2"
                  >
                    Back to Drivers
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Updatedrivers;