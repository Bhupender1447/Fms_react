import { Link } from "react-router-dom";
/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UpdateTruck = () => {

    const {id} = useParams();
  const [formData, setFormData] = useState({
    name: '',
    plateno: '',
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
    widthunits: '',
    gps: '',
    color: '',
    weight: '',
    weightunits: '',
    height: '',
    heightunits: '',
    ifta: '',
    owneroperated: ''
  });

  useEffect(() => {
    // Fetch existing data for the truck and populate the form
    axios.get(`https://isovia.ca/fms_api/api/updatetrucks/${id}`)
      .then(response => {
        const truckData = response.data.product_data;
        setFormData({
          ...truckData,
          product_image: null, // Handle image separately if needed
          ifta: truckData.ifta === 'YES',
          owneroperated: truckData.owneroperated === 'YES'
        });
      })
      .catch(error => {
        console.error('Error fetching truck data:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      if (key === 'product_image' && formData[key] !== null) {
        data.append(key, formData[key]);
      } else if (key !== 'product_image') {
        data.append(key, formData[key]);
      }
    }

    axios.post(`https://isovia.ca/fms_api/api/updatetrucks/${id}`, data)
      .then(response => {
        console.log('Success:', response.data);
        // Handle success response
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error
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
    <form
      role="form"
      onSubmit={handleSubmit}
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
            <label htmlFor="name">Truck</label>
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
            <label htmlFor="plateno">Plate#</label>
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
            <label htmlFor="trucktype">Truck Type</label>
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
            <label htmlFor="vin">VIN#</label>
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
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="model">Model</label>
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
            />
          </div>
        </div>
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
            <label htmlFor="fueltype">Fuel Type</label>
            <select
              className="form-control"
              id="fueltype"
              name="fueltype"
              value={formData.fueltype}
              onChange={handleChange}
            >
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>
        <div className="col-md-2 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="fuelcard1">Fuel Card 1</label>
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
            <label htmlFor="fuelcard2">Fuel Card 2</label>
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
            <label htmlFor="fuelcard3">Fuel Card 3</label>
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
            <label htmlFor="driver1">Driver 1</label>
            <select
              className="form-control"
              id="driver1"
              name="driver1"
              value={formData.driver1}
              onChange={handleChange}
            >
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="driver2">Driver 2</label>
            <select
              className="form-control"
              id="driver2"
              name="driver2"
              value={formData.driver2}
              onChange={handleChange}
            >
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="stopnotes">Remarks</label>
            <textarea
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
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              className="form-control"
              id="company"
              name="company"
              placeholder="Enter Company"
              autoComplete="off"
              value={formData.company}
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
            </select>
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select
              className="form-control"
              id="state"
              name="state"
              value={formData.state}
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
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="odometer">Odometer</label>
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
            <label htmlFor="units">Units</label>
            <select
              className="form-control"
              id="units"
              name="units"
              value={formData.units}
              onChange={handleChange}
            >
              <option value="Kms">Kms</option>
            </select>
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="owner">Owner</label>
            <input
              type="text"
              className="form-control"
              id="owner"
              name="owner"
              placeholder="Enter Owner"
              autoComplete="off"
              value={formData.owner}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="length">Length</label>
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
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="lengthunits">Length Units</label>
            <input
              type="text"
              className="form-control"
              id="lengthunits"
              name="lengthunits"
              placeholder="Enter Length Units"
              autoComplete="off"
              value={formData.lengthunits}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="width">Width</label>
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
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="widthunits">Width Units</label>
            <input
              type="text"
              className="form-control"
              id="widthunits"
              name="widthunits"
              placeholder="Enter Width Units"
              autoComplete="off"
              value={formData.widthunits}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="gps">GPS</label>
            <input
              type="text"
              className="form-control"
              id="gps"
              name="gps"
              placeholder="Enter GPS"
              autoComplete="off"
              value={formData.gps}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="color">Color</label>
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
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <input
              type="text"
              className="form-control"
              id="weight"
              name="weight"
              placeholder="Enter Weight"
              autoComplete="off"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="weightunits">Weight Units</label>
            <input
              type="text"
              className="form-control"
              id="weightunits"
              name="weightunits"
              placeholder="Enter Weight Units"
              autoComplete="off"
              value={formData.weightunits}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="height">Height</label>
            <input
              type="text"
              className="form-control"
              id="height"
              name="height"
              placeholder="Enter Height"
              autoComplete="off"
              value={formData.height}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="heightunits">Height Units</label>
            <input
              type="text"
              className="form-control"
              id="heightunits"
              name="heightunits"
              placeholder="Enter Height Units"
              autoComplete="off"
              value={formData.heightunits}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-2 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="ifta">IFTA</label>
            <input
              type="checkbox"
              id="ifta"
              name="ifta"
              checked={formData.ifta}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-2 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="owneroperated">Owner Operated</label>
            <input
              type="checkbox"
              id="owneroperated"
              name="owneroperated"
              checked={formData.owneroperated}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-2 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="product_image">Image Upload</label>
            <input
              type="file"
              className="form-control"
              id="product_image"
              name="product_image"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>
      <div className="box-footer">
        <button type="submit" className="btn btn-primary">Save Changes</button>
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
  );
};

export default UpdateTruck;
