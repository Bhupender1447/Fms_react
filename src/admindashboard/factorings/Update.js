/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom';

const Updatefactorings = () => {
  const {id} = useParams();
  const [formData, setFormData] = useState({
    name: '',
    address1: '',
    address2: '',
    country: 'CA',
    state: 'NF',
    city: '',
    zip: '',
    region: 'YT',
    firstpayment: '',
    discount: 'GEN',
    discounttype: 'Percentage',
    value: '',
    qb: 'NO',
    remarks: '<p>sdsdsdsdsdsd</p>',
    _wysihtml5_mode: '1',
    company: '',
    website: '',
    phone: '',
    ext: '',
    altphone: '',
    altext: '',
    email: '',
    fax: '',
    additionalRemarks: 'Excepteur vel non od'
  });

 
      
  const [file] = useState(null);

  useEffect(() => {
    const fetchTrailerData = async () => {
      try {
        const response = await axios.get(`https://isovia.ca/fms_api/api/updatefactorings/${id}`);
        setFormData(response.data.product_data);
      } catch (error) {
        console.error('Error fetching factorings data:', error);
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

    if (file) {
      formDataToSend.append('product_image', file);
    }

    try {
      const response = await axios.post(`https://isovia.ca/fms_api/api/updatefactorings/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      alert('factorings updated successfully!');
    } catch (error) {
      console.error('Error updating factorings data:', error);
      alert('Error updating factorings data.');
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Carriers</small>
      </h1>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div id="messages" />
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Add Carriers</h3>
            </div>
            {/* /.box-header */}
            <form
              role="form"
              action=""
              method="post"
              encType="multipart/form-data"
            onSubmit={handleSubmit}
            >
              <div className="box-body">
                <div className="col-md-6 col-xs-12 pull pull-left">
                  {/*
           <div class="col-md-06 col-xs-12 pull pull-left">
                    
        <label for="formFileSm" class="form-label">Upload Image</label>
        <input class="form-control form-control-sm" name="product_image" id="product_image" type="file" />
  
                    
                    </div> */}
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
                      <select className="form-control" id="state" name="state">
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
                      <label htmlFor="store">Region</label>
                      <select className="form-control" id="region" name="region"   value={formData.region}
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
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">First Payment</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstpayment"
                        name="firstpayment"
                        placeholder="Enter First Payment"
                        autoComplete="off"
                        value={formData.firstpayment}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Discount Name</label>
                      <select
                        className="form-control"
                        id="discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                      >
                        <option value="GEN">General</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Discount Type</label>
                      <select
                        className="form-control"
                        id="discounttype"
                        name="discounttype"
                        value={formData.discounttype}
                        onChange={handleChange}
                      >
                        <option value="Flat">Flat</option>
                        <option value="Percentage">Percentage</option>
                        <option value="Mile Rate">Mile Rate</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Value</label>
                      <input
                        type="text"
                        className="form-control"
                        id="value"
                        name="value"
                        placeholder="Enter Value"
                        autoComplete="off"
                        value={formData.value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Synq to QB</label>
                      <select className="form-control" id="qb" name="qb"   value={formData.qb}
                        onChange={handleChange}>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </div>
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
                                  <Link className="close" data-dismiss="modal">
                                    ×
                                  </Link>
                                  <h3>Insert link</h3>
                                </div>
                                <div className="modal-body">
                                  <div className="form-group">
                                    <input
                                      defaultValue="http://"
                                      className="bootstrap-wysihtml5-insert-link-url form-control"
                                      data-wysihtml5-dialog-field="href"
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
                                  <Link className="close" data-dismiss="modal">
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
                        placeholder="Enter 
              Remarks"
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
                          boxShadow: "rgba(0, 0, 0, 0.075) 0px 1px 1px 0px inset",
                          borderRadius: 4,
                          width: "100%",
                          height: "auto"
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-right">
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
                      <label htmlFor="username">Alt.Phone #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="altphone"
                        name="altphone"
                        placeholder="Enter Phone"
                        autoComplete="off"
                        value={formData.altphone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Alt.Ext #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="altext"
                        name="altext"
                        placeholder="Enter Ext."
                        autoComplete="off"
                        value={formData.altext}
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
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        placeholder="Enter 
              description"
                        autoComplete="off"
                        value={formData.remarks}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* /.box-body */}
              <div className="box-footer">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <Link
                  to="/customers/"
                  className="btn btn-warning"
                >
                  Back
                </Link>
              </div>
            </form>
            {/* /.box-body */}
          </div>
          {/* /.box */}
        </div>
        {/* col-md-12 */}
      </div>
      {/* /.row */}
    </section>
    {/* /.content */}
  </div>
  
  )
}

export default Updatefactorings