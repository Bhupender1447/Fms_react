import axios from 'axios';
import React, { useState } from 'react'
import {Link } from 'react-router-dom';


const Createcustomer = () => {
    const [formData, setFormData] = useState({
        ctype: '',
        name: '',
        address1: '',
        address2: '',
        lat: '',
        long: '',
        csa: '',
        ctpat: 'ES',
        pip: '',
        db: '',
        stopnotes: '',
        company: '',
        legal: '',
        website: '',
        phone: '',
        tollfree: '',
        ext: '',
        email: '',
        fax: '',
        pickupmail: '',
        deliverymail: '',
        remarks: '',
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    
      const handleFileChange = (e) => {
        setFormData({
          ...formData,
          product_image: e.target.files[0]
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataToSend = new FormData();
        for (let key in formData) {
          formDataToSend.append(key, formData[key]);
        }
    
        try {
          const response = await axios.post('https://isovia.ca/fms_api/api/createcustomers', formDataToSend);
    
          console.log(response.data); // Log response data
        } catch (error) {
          console.error('Error:', error);
        }
      };
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Customers</small>
      </h1>
      <ol className="breadcrumb">
        <li>
          <Link to="#">
            <i className="fa fa-dashboard" /> Home
          </Link>
        </li>
        <li className="active">Customers</li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div id="messages" />
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Add Customers</h3>
            </div>
            {/* /.box-header */}
            <form
              role="form"
           onSubmitCapture={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="box-body">
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <br />
                  <br />
                  <br />
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Type</label>
                      <select className="form-control" id="ctype" name="ctype" value={formData.ctype} onChange={handleChange}>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="">BROKER</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-8 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Name</label>
                      <input
                        type="text"
                        className="form-control pac-target-input"
                        id="name"
                        name="name"
                        placeholder="Enter Name"
                        autoComplete="off"
                        value={formData.name} onChange={handleChange}
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
                        value={formData.address1} onChange={handleChange}
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
                        value={formData.address2} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Lattitude</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lat"
                        name="lat"
                        placeholder="Enter Address"
                        autoComplete="off"
                        value={formData.lat} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">longitude</label>
                      <input
                        type="text"
                        className="form-control"
                        id="long"
                        name="long"
                        placeholder="Enter Address"
                        autoComplete="off"
                        value={formData.long} onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/*    
                
                  <div class="col-md-6 col-xs-12 pull pull-left">
                <div class="form-group">
                <label for="store">Country</label>
                <select class="form-control" id="country" name="country">
                <option value="CA">Canada</option>
                
                </select>
                </div>
            </div>
                
                
                
                
                
                <div class="col-md-6 col-xs-12 pull pull-left">
                <div class="form-group">
                <label for="store">State/Province</label>
                <select class="form-control" id="state" name="state">
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
  
                
                  <div class="col-md-6 col-xs-12 pull pull-left">
                
                    <div class="form-group">
                    <label for="username">City</label>
                    <input type="text" class="form-control" id="city" name="city" placeholder="Enter City" autocomplete="off">
                    </div>
                
                </div>
                
                 <div class="col-md-6 col-xs-12 pull pull-left">
                
                    <div class="form-group">
                    <label for="username">Postal/Zip code</label>
                    <input type="text" class="form-control" id="zip" name="zip" placeholder="Enter Postal/Zip Code" autocomplete="off">
                    </div>
                
                </div>
                <!--
              <div class="col-md-4 col-xs-12 pull pull-left">
                <div class="form-group">
                <label for="store">Region</label>
                <select class="form-control" id="region" name="region">
                <option value="1.0">1.0KW</option>
                <option value="2.0">2.0KW</option>
                </select>
                </div>
                </div> */}
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">CSA</label>
                      <select className="form-control" id="csa" name="csa"value={formData.csa} onChange={handleChange}>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">CTPAT</label>
                      <select className="form-control" id="ctpat" name="ctpat" value={formData.ctpat} onChange={handleChange}>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">PIP</label>
                      <select className="form-control" id="pip" name="pip" value={formData.pip} onChange={handleChange}>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">sync to QB</label>
                      <select className="form-control" id="db" name="db" value={formData.db} onChange={handleChange}>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
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
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="description">Stop Notes</label>
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
                        id="stopnotes"
                        name="stopnotes"
                        autoComplete="off"
                        placeholder="Enter 
              Stop Notes"
                        style={{ display: "none" }}
                        value={formData.stopnotes} onChange={handleChange}
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
                        value={formData.company} onChange={handleChange}
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
                        value={formData.legal} onChange={handleChange}
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
                        value={formData.website} onChange={handleChange}
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
                        value={formData.phone} onChange={handleChange}
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
                        value={formData.tollfree} onChange={handleChange}
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
                        value={formData.ext} onChange={handleChange}
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
                        value={formData.email} onChange={handleChange}
                      />
                    </div>
                    <br />
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Fax</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fax"
                        name="fax"
                        placeholder="Fax"
                        autoComplete="off"
                        value={formData.fax} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Pickup mail Confirmation</label>
                      <select
                        className="form-control"
                        id="pickupmail"
                        name="pickupmail"
                        value={formData.pickupmail} onChange={handleChange}
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store"> Delivery Confirmation Mail</label>
                      <select
                        className="form-control"
                        id="deliverymail"
                        name="deliverymail"
                        value={formData.deliverymail} onChange={handleChange}
                      >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
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
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
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
              description"
                        style={{ display: "none" }}
                        value={formData.remarks} onChange={handleChange}
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

export default Createcustomer