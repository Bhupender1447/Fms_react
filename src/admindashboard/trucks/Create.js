import axios from 'axios';
import React, { useState } from 'react'

const Createtrucks = () => {
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
    widtunits: '',
    gps: '',
    color: '',
    weight: '',
    weightunits: '',
    height: '',
    heightunits: '',
    ifta:'',
    owneroperated:''
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleImageChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
};

const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
        data.append(key, formData[key]);
    }

    axios.post('https://isovia.ca/fms_api/trucks/create', data)
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
        <a href="#">
          <i className="fa fa-dashboard" /> Home
        </a>
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
                    <option value="CA">Canada</option>
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
                      value={formData.ifta}
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
                    placeholder="Enter 
          Remarks"
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
                    placeholder="Enter  Company Name"
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
                        onclick="alert('Call your custom code here.')"
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
                      value={formData.owneroperated}
                    onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="ifta"></label>
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
                    placeholder="Enter  Length"
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
                    placeholder="Enter  Width"
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
                    value={formData.weightunits}
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
                    placeholder="Enter  GPS Device#"
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
                    placeholder="Enter  Color"
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
                    id="weigth"
                    name="weight"
                    placeholder="Enter  weight"
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
                    id="weigthunits"
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
                    placeholder="Enter  height"
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
            </div>
          </form>
        </div>
        {/* /.box-body */}
        <div className="box-footer">
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Save Changes
          </button>
          <a href="https://isovia.ca/fms/trucks/" className="btn btn-warning">
            Back
          </a>
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