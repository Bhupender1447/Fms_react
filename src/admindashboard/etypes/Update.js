/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom';

const Updateetypes = () => {
    const {id} = useParams();
  const [formData, setFormData] = useState({
    name: '',
    etype: '',
    remarks: '',
    _wysihtml5_mode: '1',
  });

  const [file] = useState(null);

  useEffect(() => {
    const fetchTrailerData = async () => {
      try {
        const response = await axios.get(`https://isovia.ca/fms_api/api/updateetypes/${id}`);
        setFormData(response.data.product_data);
      } catch (error) {
        console.error('Error fetching etypes data:', error);
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
      const response = await axios.post(`https://isovia.ca/fms_api/api/updateetypes/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      alert('etypes updated successfully!');
    } catch (error) {
      console.error('Error updating etypes data:', error);
      alert('Error updating etypes data.');
    }
  };
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
  {/* Content Header (Page header) */}
  <section className="content-header">
    <h1>
      Manage
      <small>Expenses</small>
    </h1>
    <ol className="breadcrumb">
      <li>
        <Link to="../cpanel/">
          <i className="fa fa-dashboard" /> Home
        </Link>
      </li>
    </ol>
  </section>
  {/* Main content */}
  <section className="content">
    {/* Small boxes (Stat box) */}
    <div className="row">
      <div className="col-md-12 col-xs-12">
        <div id="messages" />
        <div className="box">
          {/* /.box-header */}
          <form
            role="form"
            action=""
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div className="box-body">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Expense Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Expense Name"
                      autoComplete="off"
                      value={formData.name} onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="store">Expense Type</label>
                    <select className="form-control" id="etype" name="etype" value={formData.etype} onChange={handleChange} >
                      <option value="disabled" disabled="">
                        Select Fuel Type
                      </option>
                      <option value="Fuel Type">Fuel Type</option>
                      <option value="Maintenance Type">
                        {" "}
                        Maintenance Type
                      </option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
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
                            Link="#"
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
                            Link="#"
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
                            Link="#"
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
                            Link="#"
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
                            Link="#"
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
                            Link="#"
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
                            Link="#"
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
                          Link="#"
                          unselectable="on"
                        >
                          Bold
                        </Link>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="italic"
                          title="CTRL+I"
                          tabIndex={-1}
                          Link="#"
                          unselectable="on"
                        >
                          Italic
                        </Link>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="underline"
                          title="CTRL+U"
                          tabIndex={-1}
                          Link="#"
                          unselectable="on"
                        >
                          Underline
                        </Link>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="small"
                          title="CTRL+S"
                          tabIndex={-1}
                          Link="#"
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
                        Link="#"
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
                          Link="#"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-list" />
                        </Link>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="insertOrderedList"
                          title="Ordered list"
                          tabIndex={-1}
                          Link="#"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-th-list" />
                        </Link>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="Outdent"
                          title="Outdent"
                          tabIndex={-1}
                          Link="#"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-indent-right" />
                        </Link>
                        <Link
                          className="btn  btn-default"
                          data-wysihtml5-command="Indent"
                          title="Indent"
                          tabIndex={-1}
                          Link="#"
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
                        Link="#"
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
                        Link="#"
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
                    placeholder="Enter  Remarks"
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
         <div className="box-footer">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <Link to="/customers/" className="btn btn-warning">
            Back
          </Link>
        </div>
          </form>
        </div>
        {/* /.box-body */}
       
        {/* /.box-body */}
      </div>
      {/* /.box */}
    </div>
    {/* col-md-12 */}
  </section>
</div>

  )
}

export default Updateetypes