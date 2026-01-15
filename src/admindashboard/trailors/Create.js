/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useState } from 'react'
import {Link } from 'react-router-dom';


const Create = () => {
  const [formData, setFormData] = useState({
    // Direct mapped fields
    plate_number: '',
    vin_number: '',
    trailer_type: '',
    make: '',
    model: '',
    year: '',
    registered_weight: '',
    weightunits: 'Kilograms',
    owner_name: '',
    country: 'CA',
    province: '',
    permit_number: '',
    permit_issue_date: '',
    permit_expiry_date: '',
    ownership_type: 'owned',
    owner_address: '',
    status: 'active',
    notes: '',
    inspection_expiry: '',
    insurance_expiry: '',
    assigned_truck_id: '',
    seal_number: '',
    
    // Additional fields from original form
    length: '',
    lengthunits: 'Feet',
    width: '',
    widthunits: 'Feet',
    height: '',
    heightunits: 'Feet',
    color: '',
    gps: '',
    fleet: '',
    third: 'NO',
  });

  const [files, setFiles] = useState({
    product_image: null,
    cab_card_file: null,
    ownership_document: null,
    inspection_document: null,
    insurance_document: null,
    permit_document: null
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (checked ? 'YES' : 'NO') : value 
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFiles({ ...files, [name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const formDataToSend = new FormData();

    // Append all form data
    for (const key in formData) {
      if (formData[key] !== '' && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append all files
    for (const key in files) {
      if (files[key]) {
        formDataToSend.append(key, files[key]);
      }
    }

    try {
      const response = await axios.post('https://isovia.ca/fms_api/api/createtrailer', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Success:', response.data);
      setSuccessMessage('Trailer created successfully!');
      // Reset form after success
      setFormData({
        plate_number: '',
        vin_number: '',
        trailer_type: '',
        make: '',
        model: '',
        year: '',
        registered_weight: '',
        weightunits: 'Kilograms',
        owner_name: '',
        country: 'CA',
        province: '',
        permit_number: '',
        permit_issue_date: '',
        permit_expiry_date: '',
        ownership_type: 'owned',
        owner_address: '',
        status: 'active',
        notes: '',
        inspection_expiry: '',
        insurance_expiry: '',
        assigned_truck_id: '',
        seal_number: '',
        length: '',
        lengthunits: 'Feet',
        width: '',
        widthunits: 'Feet',
        height: '',
        heightunits: 'Feet',
        color: '',
        gps: '',
        fleet: '',
        third: 'NO',
      });
      setFiles({
        product_image: null,
        cab_card_file: null,
        ownership_document: null,
        inspection_document: null,
        insurance_document: null,
        permit_document: null
      });
    } catch (error) {
      console.error('Error occurred:', error.response?.data || error.message);
      setErrorMessage('Error creating trailer. Please try again.');
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header (Page header) */}
      <section className="content-header">
        <h1>
          Manage
          <small>Trailers</small>
        </h1>
      </section>
      
      {/* Main content */}
      <section className="content">
        {/* Messages */}
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages">
              {successMessage && (
                <div className="alert alert-success alert-dismissible" role="alert">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setSuccessMessage('')}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setErrorMessage('')}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  {errorMessage}
                </div>
              )}
            </div>
            
            <div className="box">
              <form role="form" onSubmit={handleSubmit}>
                <div className="box-body">
                  {/* Trailer Details Section */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <h4>
                        <span className="label label-success">Trailer Details</span>
                      </h4>
                    </div>
                  </div>

                  {/* Plate Number */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="plate_number">Plate #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="plate_number"
                        name="plate_number"
                        placeholder="Enter Plate #"
                        autoComplete="off"
                        value={formData.plate_number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* VIN Number */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="vin_number">VIN #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="vin_number"
                        name="vin_number"
                        placeholder="Enter VIN #"
                        autoComplete="off"
                        value={formData.vin_number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Trailer Type */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="trailer_type">Trailer Type</label>
                      <select
                        className="form-control"
                        id="trailer_type"
                        name="trailer_type"
                        value={formData.trailer_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="BOX TRUCK">BOX TRUCK</option>
                        <option value='Dry VAN 53"'>Dry VAN 53"</option>
                        <option value='Refirigrated Trailors/Reefers Vn 53"'>
                          Refirigrated Trailors/Reefers Vn 53"
                        </option>
                        <option value='Refirigrated Trailors/Reefers Vn 25"'>
                          Refirigrated Trailors/Reefers Vn 28"
                        </option>
                        <option value="Flatbed Trailors">Flatbed Trailors</option>
                        <option value="Step Deck/Single Drop Trailors">
                          Step Deck/Single Drop Trailors
                        </option>
                        <option value="Low Boy or Double-Drop Trailors">
                          Low Boy or Double-Drop Trailors
                        </option>
                        <option value="RGN OR Removable GooSeneck Trailors">
                          RGN OR Removable GooSeneck Trailors
                        </option>
                        <option value="Constoga or Curtainside Trailors">
                          Constoga or Curtainside Trailors
                        </option>
                        <option value="Sprinter VAN">Sprinter VAN</option>
                        <option value="20 feet sea container(closed top)">
                          20 feet sea container(closed top)
                        </option>
                        <option value="20 feet sea container(open top)">
                          20 feet sea container(open top)
                        </option>
                        <option value="40 feet sea container(closed top)">
                          40 feet sea container(closed top)
                        </option>
                        <option value="40 feet sea container(open top)">
                          40 feet sea container(open top)
                        </option>
                        <option value="Auto Carrier Trailer">
                          Auto Carrier Trailer
                        </option>
                        <option value="Beverage Rack Trailer">
                          Beverage Rack Trailer
                        </option>
                        <option value="Chassis">Chassis</option>
                        <option value="Container(closed top)">
                          Container(closed top)
                        </option>
                        <option value="Container(open top)">
                          Container(open top)
                        </option>
                        <option value="Double-drop trailer">
                          Double-drop trailer
                        </option>
                        <option value="Drop back Trailer">Drop back Trailer</option>
                      </select>
                    </div>
                  </div>

                  {/* Make */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="make">Make</label>
                      <input
                        type="text"
                        className="form-control"
                        id="make"
                        name="make"
                        placeholder="Enter Make"
                        autoComplete="off"
                        value={formData.make}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Model */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="model">Model</label>
                      <input
                        type="text"
                        className="form-control"
                        id="model"
                        name="model"
                        placeholder="Enter Model"
                        autoComplete="off"
                        value={formData.model}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Year */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="year">Year</label>
                      <input
                        type="text"
                        className="form-control"
                        id="year"
                        name="year"
                        placeholder="Enter Year"
                        autoComplete="off"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Fleet */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="fleet">Fleet</label>
                      <select 
                        className="form-control" 
                        id="fleet" 
                        name="fleet"
                        value={formData.fleet}
                        onChange={handleChange}
                      >
                        <option value="">Select Fleet</option>
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

                  {/* Third Party */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="third">Third Party</label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="third"
                          id="third"
                          checked={formData.third === 'YES'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="third">
                          Is Third Party
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notes/Remarks */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="notes">Notes/Remarks</label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        placeholder="Enter Notes/Remarks"
                        autoComplete="off"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Company Details Section */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <h4>
                        <span className="label label-success">Company Details</span>
                      </h4>
                    </div>
                  </div>

                  {/* Owner Name */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="owner_name">Company/Owner Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="owner_name"
                        name="owner_name"
                        placeholder="Enter Company/Owner Name"
                        autoComplete="off"
                        value={formData.owner_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Ownership Type */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="ownership_type">Ownership Type</label>
                      <select
                        className="form-control"
                        id="ownership_type"
                        name="ownership_type"
                        value={formData.ownership_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="owned">Owned</option>
                        <option value="leased">Leased</option>
                        <option value="rented">Rented</option>
                      </select>
                    </div>
                  </div>

                  {/* Owner Address */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="owner_address">Owner Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="owner_address"
                        name="owner_address"
                        placeholder="Enter Owner Address"
                        autoComplete="off"
                        value={formData.owner_address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Registration Country */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="country">Registration Country</label>
                      <select 
                        className="form-control" 
                        id="country" 
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="CA">Canada</option>
                        <option value="US">United States</option>
                      </select>
                    </div>
                  </div>

                  {/* Registration Province/State */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="province">Registration Province/State</label>
                      <select 
                        className="form-control" 
                        id="province" 
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Province/State</option>
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

                  {/* Permit Details */}
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="permit_number">Permit Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="permit_number"
                        name="permit_number"
                        placeholder="Enter Permit Number"
                        value={formData.permit_number}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="permit_issue_date">Permit Issue Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="permit_issue_date"
                        name="permit_issue_date"
                        value={formData.permit_issue_date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="permit_expiry_date">Permit Expiry Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="permit_expiry_date"
                        name="permit_expiry_date"
                        value={formData.permit_expiry_date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Expiry Dates */}
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="inspection_expiry">Inspection Expiry</label>
                      <input
                        type="date"
                        className="form-control"
                        id="inspection_expiry"
                        name="inspection_expiry"
                        value={formData.inspection_expiry}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="insurance_expiry">Insurance Expiry</label>
                      <input
                        type="date"
                        className="form-control"
                        id="insurance_expiry"
                        name="insurance_expiry"
                        value={formData.insurance_expiry}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Assigned Truck ID */}
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="assigned_truck_id">Assigned Truck ID</label>
                      <input
                        type="text"
                        className="form-control"
                        id="assigned_truck_id"
                        name="assigned_truck_id"
                        placeholder="Enter Truck ID"
                        value={formData.assigned_truck_id}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Seal Number */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="seal_number">Seal Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="seal_number"
                        name="seal_number"
                        placeholder="Enter Seal Number"
                        value={formData.seal_number}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Trailer Specifications Section */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <h4>
                        <span className="label label-success">Trailer Specifications</span>
                      </h4>
                    </div>
                  </div>

                  {/* Length */}
                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="length">Length</label>
                      <input
                        type="number"
                        className="form-control"
                        id="length"
                        name="length"
                        placeholder="Length"
                        value={formData.length}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="lengthunits">Length Units</label>
                      <select
                        className="form-control"
                        id="lengthunits"
                        name="lengthunits"
                        value={formData.lengthunits}
                        onChange={handleChange}
                      >
                        <option value="Feet">Feet</option>
                        <option value="Inches">Inches</option>
                        <option value="Meter">Meter</option>
                        <option value="Cms">Centimeter</option>
                      </select>
                    </div>
                  </div>

                  {/* Width */}
                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="width">Width</label>
                      <input
                        type="number"
                        className="form-control"
                        id="width"
                        name="width"
                        placeholder="Width"
                        value={formData.width}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="widthunits">Width Units</label>
                      <select
                        className="form-control"
                        id="widthunits"
                        name="widthunits"
                        value={formData.widthunits}
                        onChange={handleChange}
                      >
                        <option value="Feet">Feet</option>
                        <option value="Inches">Inches</option>
                        <option value="Meter">Meter</option>
                        <option value="Cms">Centimeter</option>
                      </select>
                    </div>
                  </div>

                  {/* Height */}
                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="height">Height</label>
                      <input
                        type="number"
                        className="form-control"
                        id="height"
                        name="height"
                        placeholder="Height"
                        value={formData.height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="heightunits">Height Units</label>
                      <select
                        className="form-control"
                        id="heightunits"
                        name="heightunits"
                        value={formData.heightunits}
                        onChange={handleChange}
                      >
                        <option value="Feet">Feet</option>
                        <option value="Inches">Inches</option>
                        <option value="Meter">Meter</option>
                        <option value="Cms">Centimeter</option>
                      </select>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="registered_weight">Max Weight</label>
                      <input
                        type="number"
                        className="form-control"
                        id="registered_weight"
                        name="registered_weight"
                        placeholder="Weight"
                        value={formData.registered_weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="weightunits">Weight Units</label>
                      <select
                        className="form-control"
                        id="weightunits"
                        name="weightunits"
                        value={formData.weightunits}
                        onChange={handleChange}
                      >
                        <option value="Kilograms">Kilograms</option>
                        <option value="Pounds">Pounds</option>
                        <option value="Metric Ton">Metric Ton</option>
                        <option value="Tons">Tons</option>
                        <option value="Gallons">Gallons</option>
                        <option value="Ounces">Ounces</option>
                      </select>
                    </div>
                  </div>

                  {/* GPS and Color */}
                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="gps">GPS Device #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="gps"
                        name="gps"
                        placeholder="GPS Device #"
                        value={formData.gps}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 col-xs-6 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="color">Color</label>
                      <input
                        type="text"
                        className="form-control"
                        id="color"
                        name="color"
                        placeholder="Color"
                        value={formData.color}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <h4>
                        <span className="label label-success">Documents</span>
                      </h4>
                    </div>
                  </div>

                  {/* Main Image */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="product_image">Trailer Image</label>
                      <div className="kv-avatar">
                        <div className="file-input file-input-new">
                          <div className="file-preview ">
                            <div className="file-drop-disabled">
                              <div className="file-preview-thumbnails"></div>
                              <div className="clearfix" />{" "}
                              <div className="file-preview-status text-center text-success" />
                              <div className="kv-fileinput-error" />
                            </div>
                          </div>{" "}
                          <button
                            type="button"
                            className="btn btn-secondary"
                            title="Add picture tags"
                          >
                            <i className="glyphicon glyphicon-tag" />
                          </button>{" "}
                          <button
                            type="button"
                            tabIndex={500}
                            title="Clear file"
                            className="btn btn-default btn-secondary fileinput-remove fileinput-remove-button"
                            onClick={() => setFiles({...files, product_image: null})}
                          >
                            <i className="glyphicon glyphicon-remove" />{" "}
                          </button>{" "}
                          <div tabIndex={500} className="btn btn-primary btn-file">
                            <i className="glyphicon glyphicon-folder-open" />{" "}
                            <input
                              id="product_image"
                              name="product_image"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Uploads */}
                  {[
                    { id: 'cab_card_file', label: 'Cab Card' },
                    { id: 'ownership_document', label: 'Ownership Document' },
                    { id: 'inspection_document', label: 'Inspection Document' },
                    { id: 'insurance_document', label: 'Insurance Document' },
                    { id: 'permit_document', label: 'Permit Document' }
                  ].map((doc) => (
                    <div className="col-md-6 col-xs-12 pull pull-left" key={doc.id}>
                      <div className="form-group">
                        <label htmlFor={doc.id}>{doc.label}</label>
                        <input
                          type="file"
                          className="form-control"
                          id={doc.id}
                          name={doc.id}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Box Footer */}
                <div className="box-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <Link to="https://isovia.ca/fms/trailors/" className="btn btn-warning">
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Create;