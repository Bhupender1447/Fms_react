import React, { useState } from 'react'

const Creatediscounttypes = () => {

  const [formData, setFormData] = useState({
    paytype: '',
    name: '',
    company: '',
    value: '',
    remarks: '',
    _wysihtml5_mode: '1',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch('https://isovia.ca/fms_api/api/creatediscounttypes', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        console.log('Form submitted successfully');
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
  {/* Content Header (Page header) */}
  <section className="content-header">
    <h1>
      Manage
      <small>Discount Types</small>
    </h1>
    <ol className="breadcrumb">
      <li>
        <a href="#">
          <i className="fa fa-dashboard" /> Home
        </a>
      </li>
      <li className="active">Discount</li>
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
            <h3 className="box-title">Add Charges</h3>
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
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Pay Type</label>
                    <select
                      className="form-control"
                      id="paytype"
                      name="paytype"
                      value={formData.paytype} onChange={handleChange}
                    >
                      <option value="Flat">Flat</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Miles Rate">Miles Rate</option>
                    </select>
                  </div>
                </div>
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
                      value={formData.name} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Company</label>
                    <select
                      className="form-control"
                      id="company"
                      name="company"
                      value={formData.company} onChange={handleChange} 
                    >
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
                {/*
               <div class="col-md-3 col-xs-12 pull pull-left">
              <div class="form-group">
              <label for="store">Charge Type</label>
              <select class="form-control" id="chargetype" name="chargetype">
              <option value="Flat">Flat</option>
               <option value="Percentage">Percentage</option>
                 <option value="Miles Rate">Miles Rate</option>
              </select>
              </div>
          </div>
          */}
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Value</label>
                    <input
                      type="text"
                      className="form-control"
                      id="value"
                      name="value"
                      placeholder="Enter Value"
                      autoComplete="off"
                      value={formData.value} onChange={handleChange} 
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
                    <ul className="wysihtml5-toolbar" style={{}}>
                      <li className="dropdown">
                        <a
                          className="btn btn-default dropdown-toggle "
                          data-toggle="dropdown"
                        >
                          <span className="glyphicon glyphicon-font" />
                          <span className="current-font">Normal text</span>
                          <b className="caret" />
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="p"
                              tabIndex={-1}
                              href="javascript:;"
                              unselectable="on"
                            >
                              Normal text
                            </a>
                          </li>
                          <li>
                            <a
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h1"
                              tabIndex={-1}
                              href="javascript:;"
                              unselectable="on"
                            >
                              Heading 1
                            </a>
                          </li>
                          <li>
                            <a
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h2"
                              tabIndex={-1}
                              href="javascript:;"
                              unselectable="on"
                            >
                              Heading 2
                            </a>
                          </li>
                          <li>
                            <a
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h3"
                              tabIndex={-1}
                              href="javascript:;"
                              unselectable="on"
                            >
                              Heading 3
                            </a>
                          </li>
                          <li>
                            <a
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h4"
                              tabIndex={-1}
                              href="javascript:;"
                              unselectable="on"
                            >
                              Heading 4
                            </a>
                          </li>
                          <li>
                            <a
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h5"
                              tabIndex={-1}
                              href="javascript:;"
                              unselectable="on"
                            >
                              Heading 5
                            </a>
                          </li>
                          <li>
                            <a
                              data-wysihtml5-command="formatBlock"
                              data-wysihtml5-command-value="h6"
                              tabIndex={-1}
                              href="javascript:;"
                              unselectable="on"
                            >
                              Heading 6
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="btn-group">
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="bold"
                            title="CTRL+B"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            Bold
                          </a>
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="italic"
                            title="CTRL+I"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            Italic
                          </a>
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="underline"
                            title="CTRL+U"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            Underline
                          </a>
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="small"
                            title="CTRL+S"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            Small
                          </a>
                        </div>
                      </li>
                      <li>
                        <a
                          className="btn  btn-default"
                          data-wysihtml5-command="formatBlock"
                          data-wysihtml5-command-value="blockquote"
                          data-wysihtml5-display-format-name="false"
                          tabIndex={-1}
                          href="javascript:;"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-quote" />
                        </a>
                      </li>
                      <li>
                        <div className="btn-group">
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="insertUnorderedList"
                            title="Unordered list"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-list" />
                          </a>
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="insertOrderedList"
                            title="Ordered list"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-th-list" />
                          </a>
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="Outdent"
                            title="Outdent"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-indent-right" />
                          </a>
                          <a
                            className="btn  btn-default"
                            data-wysihtml5-command="Indent"
                            title="Indent"
                            tabIndex={-1}
                            href="javascript:;"
                            unselectable="on"
                          >
                            <span className="glyphicon glyphicon-indent-left" />
                          </a>
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
                                <a className="close" data-dismiss="modal">
                                  ×
                                </a>
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
                                <a
                                  className="btn btn-default"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="cancel"
                                  href="#"
                                >
                                  Cancel
                                </a>
                                <a
                                  href="#"
                                  className="btn btn-primary"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="save"
                                >
                                  Insert link
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <a
                          className="btn  btn-default"
                          data-wysihtml5-command="createLink"
                          title="Insert link"
                          tabIndex={-1}
                          href="javascript:;"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-share" />
                        </a>
                      </li>
                      <li>
                        <div
                          className="bootstrap-wysihtml5-insert-image-modal modal fade"
                          data-wysihtml5-dialog="insertImage"
                        >
                          <div className="modal-dialog ">
                            <div className="modal-content">
                              <div className="modal-header">
                                <a className="close" data-dismiss="modal">
                                  ×
                                </a>
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
                                <a
                                  className="btn btn-default"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="cancel"
                                  href="#"
                                >
                                  Cancel
                                </a>
                                <a
                                  className="btn btn-primary"
                                  data-dismiss="modal"
                                  data-wysihtml5-dialog-action="save"
                                  href="#"
                                >
                                  Insert image
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <a
                          className="btn  btn-default"
                          data-wysihtml5-command="insertImage"
                          title="Insert image"
                          tabIndex={-1}
                          href="javascript:;"
                          unselectable="on"
                        >
                          <span className="glyphicon glyphicon-picture" />
                        </a>
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
            </div>
            {/* /.box-body */}
            <div className="box-footer">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <a
                href="/customers/"
                className="btn btn-warning"
              >
                Back
              </a>
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

export default Creatediscounttypes