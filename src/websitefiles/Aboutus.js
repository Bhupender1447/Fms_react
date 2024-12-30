import React from "react";

const Aboutus = () => {
  return (
    <>
      <section className="about_section layout_padding2-bottom">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="heading_style">Arshdeep Singh Chatha – CEO and Founder of Isovia Inc.
              </h2>
              <p>
              Arshdeep Singh Chatha, the visionary CEO of Isovia Inc., embarked on a journey in 2015 to transform the logistics and freight industry through high-tech solutions. His early experience as a dispatcher and freight broker for numerous companies provided him with a deep understanding of logistics challenges and inspired the development of a one-stop, AI-powered Freight Management System (FMS) designed to elevate businesses of all sizes. Isovia’s TMS (Transportation Management System) software is the first step in realizing this vision, offering a scalable platform that enhances operational efficiency and profitability.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="about_img-box">
                <img src="images/a-truck.jpeg" alt="" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6 about_detail-container">
              <div className="about_detail-box">
                <h3>ISOVIA INC</h3>
                <p>
                 

                  Under Arshdeep's leadership, Isovia Inc. aims to revolutionize the logistics industry with advanced, accessible technology. Beyond TMS, Isovia is developing an AI Safety Assist tool for real-time guidance on compliance and safety practices to promote secure operations across partner companies. Future plans also include launching an integrated Load Board platform, which will foster a robust local network of trusted logistics partners and facilitate secure, economical transactions.
</p>
<p>
                  With a unique blend of industry experience and technical expertise, Arshdeep leads Isovia’s mission to support a seamless, profitable workflow for the logistics sector, empowering companies with cutting-edge, tailored solutions to meet today’s challenges and tomorrow’s opportunities.
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
