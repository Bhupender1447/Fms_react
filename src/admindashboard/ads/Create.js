import React, { useState } from 'react';
import axios from 'axios';

const Createads = () => {
  // State management for form fields
  const [formData, setFormData] = useState({
    name: '',
    mode: 'Flat',
    amount: '',
    company: 'Canada',
    type: 'Addition',
    istaxable: 'YES',
    istaxapplied: 'YES',
    isexpense: 'YES',
    vpay: 'Eligible',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    
    try {
      const response = await axios.post('https://isovia.ca/fms_api/api/createads', data );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage
          <small>Addition Deductions</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <a href="../cpanel/">
              <i className="fa fa-dashboard" /> Home
            </a>
          </li>
        </ol>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <div className="box">
              <form role="form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="box-body">
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Enter Name"
                          value={formData.name}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="mode">Mode</label>
                        <select
                          className="form-control"
                          id="mode"
                          name="mode"
                          value={formData.mode}
                          onChange={handleChange}
                        >
                          <option value="Flat">Flat</option>
                          <option value="Percentage">Percentage</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                          type="text"
                          className="form-control"
                          id="amount"
                          name="amount"
                          placeholder="Enter amount"
                          value={formData.amount}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <select
                          className="form-control"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                        >
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select
                          className="form-control"
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="Addition">Addition</option>
                          <option value="Deduction">Deduction</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="istaxable">Is Taxable</label>
                        <select
                          className="form-control"
                          id="istaxable"
                          name="istaxable"
                          value={formData.istaxable}
                          onChange={handleChange}
                        >
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="istaxapplied">Is Tax Applied</label>
                        <select
                          className="form-control"
                          id="istaxapplied"
                          name="istaxapplied"
                          value={formData.istaxapplied}
                          onChange={handleChange}
                        >
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="isexpense">Is Expense</label>
                        <select
                          className="form-control"
                          id="isexpense"
                          name="isexpense"
                          value={formData.isexpense}
                          onChange={handleChange}
                        >
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="vpay">Vacation Pay</label>
                        <select
                          className="form-control"
                          id="vpay"
                          name="vpay"
                          value={formData.vpay}
                          onChange={handleChange}
                        >
                          <option value="Eligible">Eligible</option>
                          <option value="Not Eligible">Not Eligible</option>
                          <option value="Accrue">Accrue</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="remarks">Remarks</label>
                        <textarea
                          type="text"
                          className="form-control"
                          id="remarks"
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleChange}
                          placeholder="Enter Remarks"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <a href="/customers/" className="btn btn-warning">
                    Back
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Createads;
