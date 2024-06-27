import React from "react";

const Service = () => {
  return (
    <>
      <section className="service_section layout_padding">
        <div className="container">
          <div className="d-flex justify-content-center">
            <h2 className="heading_style">Our Services</h2>
          </div>
          <div className="row layout_padding2-top">
            <div className="col-md-4">
              <div className="service_img-box s-b-1">
                <img src="images/service-1.jpg" alt="" />
                <div className="d-flex">
                  <h3>CARGO</h3>
                </div>
              </div>
              <div className="service-detail">
                <p>
                  aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur.Excepteur
                </p>
                <div className="d-flex justify-content-end">
                  <a href="" className="service-btn">
                    See More
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service_img-box s-b-2">
                <img src="images/service-2.jpg" alt="" />
                <div className="d-flex">
                  <h3>LOGISTIC SERVICE</h3>
                </div>
              </div>
              <div className="service-detail">
                <p>
                  aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur.Excepteur
                </p>
                <div className="d-flex justify-content-end">
                  <a href="" className="service-btn">
                    See More
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service_img-box s-b-3">
                <img src="images/service-3.jpg" alt="" />
                <div className="d-flex">
                  <h3>STORAGE</h3>
                </div>
              </div>
              <div className="service-detail">
                <p>
                  aliquip ex ea commodo consequat. Duis aute irure dolor in
                  reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur.Excepteur
                </p>
                <div className="d-flex justify-content-end">
                  <a href="" className="service-btn">
                    See More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Service;
