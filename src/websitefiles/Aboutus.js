import React from "react";

const Aboutus = () => {
  return (
    <>
      <section className="about_section layout_padding2-bottom">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="heading_style">About Us ISOVIA INC</h2>
              <p>
                About ISOVIA INC. We are the team of young aspirants having vast
                experience in Transport sector & IT Sector. Dispatching. Fleet
                Management. Load Board Customer is the priority of a
                service-oriented business like freight forwarding. With
                INSOVIA’s all-in-one suite of tools and features, you’re
                providing premium services that would save a large amount of
                your client’s time and money, and build loyalty to your brand.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="about_img-box">
                <img src="images/a-truck.jpg" alt="" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6 about_detail-container">
              <div className="about_detail-box">
                <h3>ISOVIA INC</h3>
                <p>
                  Customer is the priority of a service-oriented business like
                  freight forwarding. With INSOVIA’s all-in-one suite of tools
                  and features, you’re providing premium services that would
                  save a large amount of your client’s time and money, and build
                  loyalty to your brand.
                </p>
                <div className="d-flex  justify-content-end">
                  <a href="" className="quote-btn about-btn">
                    <img src="images/white-next.png" alt="" />
                    <span>About More</span>
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

export default Aboutus;
