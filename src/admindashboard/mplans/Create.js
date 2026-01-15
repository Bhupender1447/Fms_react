/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/no-redundant-roles */

import { useState } from 'react'
import { Link } from "react-router-dom";


const Createmplans = () => {

  const [formData, setFormData] = useState({
    mfor: '',
    company: '',
    mtype: '',
    sstatus: '',
    amount: '',
    currency: '',
    type: '',
    frequency: '',
    sdate: '',
    reminder: 'NO',
    remarks: '',
    _wysihtml5_mode: '1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>&gt;Maintenance Plan</small>
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
              <h3 className="box-title">Add Maintenance Plan</h3>
            </div>
            {/* /.box-header */}
            <form
              role="form"
              action=""
              method="post"
              encType="multipart/form-data"
            >
              <div className="box-body">
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <br />
                  {/*
      <div class="col-md-06 col-xs-12 pull pull-left">
      
      <label for="formFileSm" class="form-label">Upload Image</label>
      <input class="form-control form-control-sm" name="product_image" id="product_image" type="file" />
      <br>
      
      </div>
      */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Maintenance for </label>
                      <select className="form-control" id="mfor" name="mfor" value={formData.mfor} onChange={handleChange}>
                        <option value="Truck">Truck</option>
                        <option value="Trailor">Trailor</option>
                        <option value="Driver">Driver</option>
                        <option value="Carrier">Carrier</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Company </label>
                      <select
                        className="form-control"
                        id="company"
                        name="company"
                        value={formData.company} onChange={handleChange}
                      >
                        <option value="Truck">Company</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Maintenance Type </label>
                      <select className="form-control" id="mtype" name="mtype" value={formData.mtype} onChange={handleChange}>
                        <option value="Truck">Mtype</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Schedule Status </label>
                      <select
                        className="form-control"
                        id="sstatus"
                        name="sstatus"
                        value={formData.sstatus} onChange={handleChange}
                      >
                        <option value="Planning">Planning</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Exppense Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        id="amount"
                        name="amount"
                        placeholder="Enter Expense Amount"
                        autoComplete="off"
                        value={formData.amount} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Currency </label>
                      <select
                        className="form-control"
                        id="currency"
                        name="currency"
                        value={formData.currency} onChange={handleChange}
                      >
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Type </label>
                      <select className="form-control" id="type" name="type" value={formData.type} onChange={handleChange}>
                        <option value="Scheduled">Scheduled</option>
                        <option value="One Time">One Time</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Frequency </label>
                      <select
                        className="form-control"
                        id="frequency"
                        name="frequency"   value={formData.frequency} onChange={handleChange} 
                      >
                        <option value="CAD">Daily</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <label htmlFor="store">Scheduled Date</label>
                    <div className="input-group date" data-provide="datepicker">
                      <input
                        type="text"
                        id="sdate"
                        name="sdate"
                        value={formData.sdate} onChange={handleChange} 
                        className="form-control"
                      />
                      <div className="input-group-addon">
                        <span className="glyphicon glyphicon-th" />
                      </div>
                    </div>
                    <br />
                  </div>
                  <br />
                  {/*
              <div class="col-md-4 col-xs-12 pull pull-left">
                <div class="form-group">
                <label for="store">Region</label>
                <select class="form-control" id="region" name="region">
                <option value="1.0">1.0KW</option>
                <option value="2.0">2.0KW</option>
                </select>
                </div>
                </div> */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Set Reinder</label>
                      <select
                        className="form-control"
                        id="reminder"
                        name="reminder"
                        value={formData.reminder} onChange={handleChange}
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
                                to="to"
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
                                to="to"
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
                                to="to"
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
                                to="to"
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
                                to="to"
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
                                to="to"
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
                                to="to"
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
                              to="to"
                              unselectable="on"
                            >
                              Bold
                            </Link>
                            <Link
                              className="btn  btn-default"
                              data-wysihtml5-command="italic"
                              title="CTRL+I"
                              tabIndex={-1}
                              to="to"
                              unselectable="on"
                            >
                              Italic
                            </Link>
                            <Link
                              className="btn  btn-default"
                              data-wysihtml5-command="underline"
                              title="CTRL+U"
                              tabIndex={-1}
                              to="to"
                              unselectable="on"
                            >
                              Underline
                            </Link>
                            <Link
                              className="btn  btn-default"
                              data-wysihtml5-command="small"
                              title="CTRL+S"
                              tabIndex={-1}
                              to="to"
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
                            to="to"
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
                              to="to"
                              unselectable="on"
                            >
                              <span className="glyphicon glyphicon-list" />
                            </Link>
                            <Link
                              className="btn  btn-default"
                              data-wysihtml5-command="insertOrderedList"
                              title="Ordered list"
                              tabIndex={-1}
                              to="to"
                              unselectable="on"
                            >
                              <span className="glyphicon glyphicon-th-list" />
                            </Link>
                            <Link
                              className="btn  btn-default"
                              data-wysihtml5-command="Outdent"
                              title="Outdent"
                              tabIndex={-1}
                              to="to"
                              unselectable="on"
                            >
                              <span className="glyphicon glyphicon-indent-right" />
                            </Link>
                            <Link
                              className="btn  btn-default"
                              data-wysihtml5-command="Indent"
                              title="Indent"
                              tabIndex={-1}
                              to="to"
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
                                      data-wysihtml5-dialog-field="to"
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
                            to="to"
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
                            to="to"
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
                        placeholder="Enter Remarks"
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
                <div className="col-md-6 col-xs-12 pull pull-right">
                  <br />
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
                </div>
              </div>
            </form>
          </div>
          {/* /.box-body */}
          <div className="box-footer">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <Link to="/customers/" className="btn btn-warning">
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

export default Createmplans