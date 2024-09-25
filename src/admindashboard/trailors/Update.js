import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Updatetrailors = () => {
    const {id} = useParams();
  
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
    third: '',
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTrailerData = async () => {
      try {
        const response = await axios.get(`https://isovia.ca/fms_api/api/updatetrailors/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching trailer data:', error);
      }
    };

    fetchTrailerData();
  }, [id]);

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

    if (file) {
      formDataToSend.append('product_image', file);
    }

    try {
      const response = await axios.post(`https://isovia.ca/fms_api/api/updatetrailors/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      alert('Trailer updated successfully!');
    } catch (error) {
      console.error('Error updating trailer data:', error);
      alert('Error updating trailer data.');
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage
          <small>Trailers</small>
        </h1>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <div className="box">
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
                  {/* Trailer details */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="trailor">Trailer</label>
                      <input
                        type="text"
                        className="form-control"
                        id="trailor"
                        name="trailor"
                        placeholder="Enter Trailer Name"
                        autoComplete="off"
                        value={formData.trailor}
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
                      <label htmlFor="trailortype">Trailer Type</label>
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
                        <option value="Auto Carrier Trailer">Auto Carrier Trailer</option>
                        <option value="Beverage Rack Trailer">Beverage Rack Trailer</option>
                        <option value="Chassis">Chassis</option>
                        <option value="Container(closed top)">Container(closed top)</option>
                        <option value="Container(open top)">Container(open top)</option>
                        <option value="Double-drop trailer">Double-drop trailer</option>
                        <option value="Drop back Trailer">Drop back Trailer</option>
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
                        placeholder="Enter Model"
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
                        <option value="YT">Yukon</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="remarks">Remarks</label>
                      <textarea
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        placeholder="Enter Remarks"
                        autoComplete="off"
                        value={formData.remarks}
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
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        placeholder="Enter Country"
                        autoComplete="off"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        placeholder="Enter State"
                        autoComplete="off"
                        value={formData.state}
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
                      <select
                        className="form-control"
                        id="lengthunits"
                        name="lengthunits"
                        value={formData.lengthunits}
                        onChange={handleChange}
                      >
                        <option value="Feet">Feet</option>
                        <option value="Meters">Meters</option>
                      </select>
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
                      <select
                        className="form-control"
                        id="widthunits"
                        name="widthunits"
                        value={formData.widthunits}
                        onChange={handleChange}
                      >
                        <option value="Inches">Inches</option>
                        <option value="Centimeters">Centimeters</option>
                      </select>
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
                      <select
                        className="form-control"
                        id="weightunits"
                        name="weightunits"
                        value={formData.weightunits}
                        onChange={handleChange}
                      >
                        <option value="Pounds">Pounds</option>
                        <option value="Kilograms">Kilograms</option>
                      </select>
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
                      <select
                        className="form-control"
                        id="heightunits"
                        name="heightunits"
                        value={formData.heightunits}
                        onChange={handleChange}
                      >
                        <option value="Inches">Inches</option>
                        <option value="Centimeters">Centimeters</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="third">Third</label>
                      <input
                        type="text"
                        className="form-control"
                        id="third"
                        name="third"
                        placeholder="Enter Third"
                        autoComplete="off"
                        value={formData.third}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="product_image">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        id="product_image"
                        name="product_image"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="box-footer">
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    Save Changes
                  </button>
                  <a href="https://isovia.ca/fms/trailors/" className="btn btn-warning">
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

export default Updatetrailors;
