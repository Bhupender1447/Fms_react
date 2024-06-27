import axios from 'axios';
import React, { useState } from 'react'

const Create = () => {
  const [formData, setFormData] = useState({
    trailor: '',
    plateno: '',
    trailortype: '',
    vin: '',
    make: '',
    model: '',
    year: '',
    fleet: '',
    remarks: '',
    company: '',
    country: '',
    state: '',
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
    third:'',
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    formDataToSend.append('product_image', file);

    try {
      const response = await axios.post('https://isovia.ca/fms_api/api/createtrailors', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Trailors</small>
      </h1>
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
                      <span className="label label-success">Trailer Details</span>
                    </h4>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Trailer</label>
                    <input
                      type="text"
                      className="form-control"
                      id="trailor"
                      name="trailor"
                      placeholder="Enter Trailor Name"
                      autoComplete="off"
                      value={formData.trailor}
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
                    <label htmlFor="store">Trailor Type</label>
                    <select
                      className="form-control"
                      id="trailortype"
                      name="trailortype"
                      value={formData.trailortype}
                      onChange={handleChange}
                    >
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
                        Constoga or Curtainside TrailorsK
                      </option>
                      <option value="Sprinter VAN">Sprinter VAN</option>
                      <option value="20 feet sea container(closed top)">
                        20 feet sea container(closed top)
                      </option>
                      <option value="20 feet sea container(open top)">
                        20 feet sea container(open top)
                      </option>
                      <option value="20 feet sea container(closed top)">
                        20 feet sea container(closed top)
                      </option>
                      <option value="40 feet sea container(closed top)">
                        40 feet sea container(closed top)
                      </option>
                      <option value="40 feet sea container(closed top)">
                        40 feet sea container(closed top)
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
                    <select className="form-control" id="fleet" name="fleet"    value={formData.fleet}
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
                    <label htmlFor="store">Third Party</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue="YES"
                        name="third"
                        id="third"
                        value={formData.third}
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
                      id="remarks"
                      name="remarks"
                      placeholder="Enter 
            Remarks"
                      autoComplete="off"
                      value={formData.remarks}
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
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Registration Country</label>
                    <select className="form-control" id="country" name="country"   value={formData.country}
                      onChange={handleChange}>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Registration State/Province</label>
                    <select className="form-control" id="state" name="state"    value={formData.state}
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
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <h4>
                      <span className="label label-success">
                        Trailor Specifications
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
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-xs-2 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Width Units</label>
                    <select
                      className="form-control"
                      id="widthhunits"
                      name="widthunits"
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
                      id="weighthunits"
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
                      id="heighthunits"
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
            <a href="https://isovia.ca/fms/trailors/" className="btn btn-warning">
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

export default Create