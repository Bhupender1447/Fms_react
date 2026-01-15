import React from 'react'

const FreightManagement = () => {
  return (
    <>
    <section className="main_banner">
      <div className="overlay" />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="drop-in">Isovia Freight Management System </h2>
          </div>
        </div>
      </div>
    </section>
    <section className="partner_Content">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <h3>Isovia Freight Management System (IFMS)</h3>
            <h2>Target Audience:</h2>
            <p>
              Freight brokers, logistics companies, and small-to-medium businesses
              handling freight.
            </p>
            <h3>Key Points:</h3>
            <p>
              <b>Efficiency Boost:</b> Highlight how the system optimizes freight
              operations with AI-powered insights.
            </p>
            <p>
              <b>Cost Reduction: </b>Showcase potential savings in fuel, labor,
              and operations by using the platform.
            </p>
            <p>
              <b>Real-Time Visibility:</b> Emphasize the GPS tracking and live
              updates for customer and stakeholder peace of mind.
            </p>
            <p>
              <b>Regulatory Compliance:</b> Focus on tools that simplify adhering
              to complex transportation regulations.
            </p>
            <p>
              <b>User-Friendly Interface:</b> Promote the intuitive design that
              enables quick onboarding and usage.
            </p>
            <p>
              <b>Scalability:</b> Market the adaptability of the system for both
              small businesses and large enterprises.
            </p>
            <p>
              <b>Integration with Industry Leaders:</b> Highlight partnerships
              with Trimble, Samsara, and FMCSA for added functionality.
            </p>
            <p>
              <b>Subscription Flexibility:</b> Offer different pricing tiers to
              cater to various customer needs and budgets.
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
                      <Link to="tel:+16472415999 ">or call us at +16472415999</Link>
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

export default FreightManagement