/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';


const Createtrucks = () => {
  const [formData, setFormData] = useState({
    name: '',
    plateno: '',
    unitno: '',
    trucktype: '',
    vin: '',
    make: '',
    model: '',
    year: '',
    fleet: '',
    fueltype: '',
    fuelcard1: '',
    fuelcard2: '',
    fuelcard3: '',
    driver1: '',
    driver2: '',
    stopnotes: '',
    company: '',
    product_image: null,
    country: '',
    state: '',
    odometer: '',
    units: '',
    owner: '',
    length: '',
    lengthunits: '',
    width: '',
    widtunits: '',
    gps: '',
    color: '',
    weight: '',
    weightunits: '',
    height: '',
    heightunits: '',
    ifta:'',
    owneroperated:'',
    // New fields from cURL request
    registration_doc: null,
    registration_expiry: '',
    insurance_doc: null,
    insurance_expiry: '',
    safety_doc: null,
    safety_expiry: '',
    permit_doc: null,
    permit_expiry: '',
    ifta_doc: null,
    ifta_expiry: '',
    ucr_doc: null,
    ucr_expiry: '',
    dot_doc: null,
    dot_expiry: '',
    irplate_doc: null,
    irplate_expiry: '',
    inspection_doc: null,
    inspection_expiry: '',
    emergency_contact_doc: null
});

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setFormData({ ...formData, [name]: checked ? 'YES' : '' });
    } else {
        setFormData({ ...formData, [name]: value });
    }
};

const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
};

const handleImageChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
};

const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
        if (formData[key] !== null && formData[key] !== '') {
            data.append(key, formData[key]);
        }
    }

    axios.post('https://isovia.ca/fms_api/api/createtrucks', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    .then(response => {
        console.log('Success:', response.data);
        // Handle success response
        alert('Truck created successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error
        alert('Error creating truck. Please try again.');
    });
};

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
  {/* Content Header (Page header) */}
  <section className="content-header">
    <h1>
      Manage
      <small>Trucks</small>
    </h1>
    <ol className="breadcrumb">
      <li>
        <Link to="#">
          <i className="fa fa-dashboard" /> Home
        </Link>
      </li>
      <li className="active">Trucks</li>
    </ol>
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
        <div className="box">
          {/* /.box-header */}
          <form
            role="form"
            action=""
            method="post"
            encType="multipart/form-data"
          >
            <div className="box-body">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <h4>
                    <span className="label label-success">Truck Details</span>
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Truck</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter Truck Name"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Plate#</label>
                  <input
                    type="text"
                    className="form-control"
                    id="plateno"
                    name="plateno"
                    placeholder="Enter Plate#"
                    autoComplete="off"
                    value={formData.plateno}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Unit Number#</label>
                  <input
                    type="text"
                    className="form-control"
                    id="unitno"
                    name="unitno"
                    placeholder="Enter Unit Number#"
                    autoComplete="off"
                    value={formData.unitno}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Truck Type</label>
                  <select
                    className="form-control"
                    id="trucktype"
                    name="trucktype"
                    value={formData.trucktype}
                    onChange={handleChange}
                  >
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">VIN#</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vin"
                    name="vin"
                    placeholder="Enter VIN#"
                    autoComplete="off"
                    value={formData.vin}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Make</label>
                  <input
                    type="text"
                    className="form-control"
                    id="make"
                    name="make"
                    placeholder="Enter Make"
                    autoComplete="off"
                    value={formData.make}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    id="model"
                    name="model"
                    placeholder="Enter model"
                    autoComplete="off"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Year</label>
                  <input
                    type="text"
                    className="form-control"
                    id="year"
                    name="year"
                    placeholder="Enter Year"
                    autoComplete="off"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Fleet</label>
                  <select className="form-control" id="fleet" name="fleet" value={formData.fleet}
                    onChange={handleChange}>
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
                  <label htmlFor="store">Fuel Type</label>
                  <select
                    className="form-control"
                    id="fueltype"
                    name="fueltype"
                    value={formData.fueltype}
                    onChange={handleChange}
                  >
                      <option value="">-- Select Fuel Type --</option>
<option value="a55">A55</option>
<option value="biodiesel">Biodiesel</option>
<option value="compressed_natural_gas">Compressed natural gas</option>
<option value="diesel">Diesel</option>
<option value="e85">E-85</option>
<option value="electric">Electric</option>
<option value="ethanol">Ethanol</option>
<option value="gasoline">Gasoline</option>
<option value="hydrogen">Hydrogen</option>
<option value="hybrid_electric">Hybrid electric</option>
<option value="liquid_natural_gas">Liquid natural gas</option>
<option value="m85">M-85</option>
<option value="methanol">Methanol</option>
<option value="plug_in_hybrid_electric">Plug-in hybrid electric</option>
<option value="propane">Propane</option>
<option value="other">Other</option>

                  </select>
                </div>
              </div>
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Fuel Card 1</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fuelcard1"
                    name="fuelcard1"
                    placeholder="Enter Fuel Card"
                    autoComplete="off"
                    value={formData.fuelcard1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Fuel Card 2</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fuelcard2"
                    name="fuelcard2"
                    placeholder="Enter Fuel Card"
                    autoComplete="off"
                    value={formData.fuelcard2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Fuel Card 3</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fuelcard3"
                    name="fuelcard3"
                    placeholder="Enter Fuel Card"
                    autoComplete="off"
                    value={formData.fuelcard3}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Driver 1</label>
                  <select className="form-control" id="driver1" name="driver1" value={formData.driver1}
                    onChange={handleChange}>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Driver 2</label>
                  <select className="form-control" id="driver2" name="driver2" value={formData.driver2}
                    onChange={handleChange}>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">IFTA</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue="YES"
                      name="ifta"
                      id="ifta"
                      checked={formData.ifta === 'YES'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="ifta"></label>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="description">Remarks</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="stopnotes"
                    name="stopnotes"
                    placeholder="Enter Remarks"
                    autoComplete="off"
                    value={formData.stopnotes}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <h4>
                    <span className="label label-success">Company Details</span>
                  </h4>
                </div>
              </div>
              <div className="col-md-06 col-xs-12 pull pull-left">
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
              <div className="col-md-06 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="product_image">Image</label>
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
                        onClick={() => alert('Call your custom code here.')}
                      >
                        <i className="glyphicon glyphicon-tag" />
                      </button>{" "}
                      <button
                        type="button"
                        tabIndex={500}
                        title="Cancel or reset changes"
                        className="btn btn-default btn-secondary fileinput-remove fileinput-remove-button"
                      >
                        <i className="glyphicon glyphicon-remove" />{" "}
                      </button>{" "}
                      <div tabIndex={500} className="btn btn-primary btn-file">
                        <i className="glyphicon glyphicon-folder-open" />{" "}
                        <input
                          id="product_image"
                          name="product_image"
                          type="file"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Registration Country</label>
                  <select className="form-control" id="country" name="country" value={formData.country}
                    onChange={handleChange}>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Registration State/Province</label>
                  <select className="form-control" id="state" name="state" value={formData.state}
                    onChange={handleChange}>
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
                  <label htmlFor="username">Odo Meter</label>
                  <input
                    type="text"
                    className="form-control"
                    id="odometer"
                    name="odometer"
                    placeholder="Enter Odometer"
                    autoComplete="off"
                    value={formData.odometer}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Units</label>
                  <select className="form-control" id="units" name="units" value={formData.units}
                    onChange={handleChange}>
                    <option value="Miles">Miles</option>
                    <option value="Kms">KiloMeter</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Owner Operated</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue="YES"
                      name="owneroperated"
                      id="owneroperated"
                      checked={formData.owneroperated === 'YES'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="owneroperated"></label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Owner</label>
                  <select className="form-control" id="owner" name="owner" value={formData.owner}
                    onChange={handleChange}>
                    <option value="OWNER">Owner</option>
                  </select>
                </div>
              </div>
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <h4>
                    <span className="label label-success">
                      Truck Specifications
                    </span>
                  </h4>
                </div>
              </div>
              <div className="col-md-02 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Length</label>
                  <input
                    type="text"
                    className="form-control"
                    id="length"
                    name="length"
                    placeholder="Enter Length"
                    autoComplete="off"
                    value={formData.length}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Units</label>
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
              <div className="col-md-02 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Width</label>
                  <input
                    type="text"
                    className="form-control"
                    id="width"
                    name="width"
                    placeholder="Enter Width"
                    autoComplete="off"
                    value={formData.width}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Width Units</label>
                  <select
                    className="form-control"
                    id="widthunits"
                    name="widtunits"
                    value={formData.widtunits}
                    onChange={handleChange}
                  >
                    <option value="Feet">Feet</option>
                    <option value="Inches">Inches</option>
                    <option value="Meter">Meter</option>
                    <option value="Cms">Centimeter</option>
                  </select>
                </div>
              </div>
              <div className="col-md-02 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">GPS Device #</label>
                  <input
                    type="text"
                    className="form-control"
                    id="gps"
                    name="gps"
                    placeholder="Enter GPS Device#"
                    autoComplete="off"
                    value={formData.gps}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-02 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    name="color"
                    placeholder="Enter Color"
                    autoComplete="off"
                    value={formData.color}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-02 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Max Weight</label>
                  <input
                    type="text"
                    className="form-control"
                    id="weight"
                    name="weight"
                    placeholder="Enter weight"
                    autoComplete="off"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Max Units</label>
                  <select
                    className="form-control"
                    id="weightunits"
                    name="weightunits"
                    value={formData.weightunits}
                    onChange={handleChange}
                  >
                    <option value="Gallons">Gallons</option>
                    <option value="Kilograms">Kilograms</option>
                    <option value="Metric Ton">Metric Ton</option>
                    <option value="Ounces">Ounces</option>
                    <option value="Pounds">Pounds</option>
                    <option value="Tons">Tons</option>
                  </select>
                </div>
              </div>
              <div className="col-md-02 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Height</label>
                  <input
                    type="text"
                    className="form-control"
                    id="height"
                    name="height"
                    placeholder="Enter height"
                    autoComplete="off"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-xs-2 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Height Units</label>
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

              {/* New Document Uploads Section */}
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <h4>
                    <span className="label label-success">Documentation</span>
                  </h4>
                </div>
              </div>

              {/* Registration Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="registration_doc">Registration Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="registration_doc"
                    name="registration_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="registration_expiry">Registration Expiry</label>
                  <input
                    type="date"
                    className="form-control"
                    id="registration_expiry"
                    name="registration_expiry"
                    value={formData.registration_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Insurance Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="insurance_doc">Insurance Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="insurance_doc"
                    name="insurance_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
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

              {/* Safety Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="safety_doc">Safety Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="safety_doc"
                    name="safety_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="safety_expiry">Safety Expiry</label>
                  <input
                    type="date"
                    className="form-control"
                    id="safety_expiry"
                    name="safety_expiry"
                    value={formData.safety_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Permit Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="permit_doc">Permit Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="permit_doc"
                    name="permit_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="permit_expiry">Permit Expiry</label>
                  <input
                    type="date"
                    className="form-control"
                    id="permit_expiry"
                    name="permit_expiry"
                    value={formData.permit_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* IFTA Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="ifta_doc">IFTA Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="ifta_doc"
                    name="ifta_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="ifta_expiry">IFTA Expiry</label>
                  <input
                    type="date"
                    className="form-control"
                    id="ifta_expiry"
                    name="ifta_expiry"
                    value={formData.ifta_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* UCR Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="ucr_doc">UCR Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="ucr_doc"
                    name="ucr_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="ucr_expiry">UCR Expiry</label>
                  <input
                    type="date"
                    className="form-control"
                    id="ucr_expiry"
                    name="ucr_expiry"
                    value={formData.ucr_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* DOT Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="dot_doc">DOT Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="dot_doc"
                    name="dot_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="dot_expiry">DOT Expiry</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dot_expiry"
                    name="dot_expiry"
                    value={formData.dot_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* IR Plate Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="irplate_doc">IR Plate Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="irplate_doc"
                    name="irplate_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="irplate_expiry">IR Plate Expiry</label>
                  <input
                    type="date"
                    className="form-control"
                    id="irplate_expiry"
                    name="irplate_expiry"
                    value={formData.irplate_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Inspection Documents */}
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="inspection_doc">Inspection Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="inspection_doc"
                    name="inspection_doc"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
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

              {/* Emergency Contact Document */}
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="emergency_contact_doc">Emergency Contact Document</label>
                  <input
                    type="file"
                    className="form-control"
                    id="emergency_contact_doc"
                    name="emergency_contact_doc"
                    onChange={handleFileChange}
                  />
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
          <Link to="https://isovia.ca/fms/trucks/" className="btn btn-warning">
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

export default Createtrucks