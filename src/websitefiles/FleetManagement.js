import React from 'react'

const FleetManagement = () => {
  return (
    <>
    <section className="main_banner">
      <div className="overlay" />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="drop-in">Isovia Fleet Management System </h2>
          </div>
        </div>
      </div>
    </section>
    <section className="partner_Content">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <h3>Isovia Fleet Management System (IFMS)</h3>
            <h2>Target Audience:</h2>
            <p>
              Fleet managers, transportation companies, and businesses with
              vehicle-dependent operations.
            </p>
            <h3>Key Points:</h3>
            <p>
              <b>Enhanced Fleet Oversight:</b> Promote real-time GPS tracking and
              monitoring features.
            </p>
            <p>
              <b>Driver Safety Focus:</b>Emphasize driver performance tracking and
              safety warnings.
            </p>
            <p>
              <b>Cost Control:</b>Highlight fuel tracking, maintenance scheduling,
              and payroll automation for reduced operational costs.
            </p>
            <p>
              <b>Proactive Maintenance:</b>Stress the importance of reduced
              downtime with predictive servicing.
            </p>
            <p>
              <b>Regulatory Adherence:</b>Simplify compliance with FMCSA and other
              industry regulations.
            </p>
            <p>
              <b>Customizable Dashboards:</b> Showcase the ease of generating
              actionable insights through analytics.
            </p>
            <p>
              <b>Accounts and Payroll: </b>Integrate financial tools to reduce
              administrative overhead.
            </p>
            <p>
              <b>Partnership Ecosystem:</b>Underscore compatibility with
              industry-standard platforms like Samsara and GoMotive.
            </p>
            <p>
              <b>Scalable for Growth:</b>Market the product’s ability to grow with
              businesses of any size.
            </p>
            <div className="popup_form">
              {/* Trigger the modal with a button */}
              <button
                type="button"
                className="Demo_button"
                data-bs-toggle="modal"
                data-bs-target="#myModal"
              >
                Get Free Demo{" "}
              </button>
              {/* Modal */}
              <div className="fade modal" id="myModal">
                <div className="modal-dialog">
                  {/* Modal content*/}
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2 className="modal-title">Get Free Demo</h2>
                      {/*           <button type="button" class="close" data-dismiss="modal">close</button>
                       */}
                    </div>
                    <div className="modal-body text-center">
                      <a href="tel:+16472415999 ">or call us at +16472415999</a>
                      <form className="popup">
                        <div className="row">
                          <div className="col-md-12 form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="company"
                              placeholder="Company"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              placeholder="Your Name"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 form-group">
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              placeholder="Email"
                            />
                          </div>
                          <div className="col-md-6 form-group">
                            <input
                              type="number"
                              className="form-control"
                              name="phone"
                              placeholder="Phone"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <textarea
                              type="text"
                              name="yourmessage"
                              placeholder="Your Message"
                              className="form-control"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 form-group">
                            <input
                              type="submit"
                              defaultValue="SEND"
                              className="btn btn-border2"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-default"
                      data-dismiss="modal"
                      style={{
                        backgroundColor: "#ea1854",
                        borderRadius: "none",
                        padding: "10px 25px",
                        color: "#fff",
                        border: "none"
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  
  )
}

export default FleetManagement