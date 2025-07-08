import React from "react";

const Aboutus = () => {
  return (
    <>
   <>
  <section className="main_banner">
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h2 className="drop-in">About Us</h2>
        </div>
      </div>
    </div>
  </section>
  <section className="about_banner">
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-xs-6 about_banner_image">
          <img src="img/a-truck.jpeg" />
        </div>
        <div className="col-md-6 col-xs-6 about_banner_text">
          <h2 className="drop-in">
            Arshdeep Singh Chatha – CEO and Founder of Isovia Inc.
          </h2>
          <p className="drop-left">
            Arshdeep Singh Chatha, the visionary CEO of Isovia Inc., embarked on
            a journey in 2015 to transform the logistics and freight industry
            through high-tech solutions. His early experience as a dispatcher
            and freight broker for numerous companies provided him with a deep
            understanding of logistics challenges and inspired the development
            of a one-stop, AI-powered Freight Management System (FMS) designed
            to elevate businesses of all sizes. Isovia’s TMS (Transportation
            Management System) software is the first step in realizing this
            vision, offering a scalable platform that enhances operational
            efficiency and profitability.
          </p>
        </div>
      </div>
    </div>
  </section>
  <section className="About_us">
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-sm-12 about_us_text">
          <h2 className="drop-in">Who We Are</h2>
          <p className="drop-right">
            Under Arshdeep's leadership, Isovia Inc. aims to revolutionize the
            logistics industry with advanced, accessible technology. Beyond TMS,
            Isovia is developing an AI Safety Assist tool for real-time guidance
            on compliance and safety practices to promote secure operations
            across partner companies. Future plans also include launching an
            integrated Load Board platform, which will foster a robust local
            network of trusted logistics partners and facilitate secure,
            economical transactions.
          </p>
          <p className="drop-left">
            With a unique blend of industry experience and technical expertise,
            Arshdeep leads Isovia’s mission to support a seamless, profitable
            workflow for the logistics sector, empowering companies with
            cutting-edge, tailored solutions to meet today’s challenges and
            tomorrow’s opportunities.
          </p>
        </div>
        <div className="col-md-6 col-sm-12 about_us_image">
          <img src="img/firstimage.gif" />
        </div>
      </div>
    </div>
  </section>
  <section className="our_shop">
    <div className="container">
      <h2>Our Shop</h2>
      <div className="row">
        <div className="col-md-6 col-sm-12 our_shop_content drop-left">
          <h2>Everything You Need</h2>
          <p>
            Check Driver speed, halts for monetring driver behaviour while
            driving Narrow down your tracking process with Geo fencing Secure
            your documents with our system by encrypting it
          </p>
        </div>
        <div className="col-md-6 col-sm-12 our_shop_image drop-right">
          <img src="img/2image.jpg" />
        </div>
      </div>
    </div>
  </section>
  <section className="bottom_map">
    <div className="col-md-12 col-xs-12">
      <div className="contact_info">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4558.805351256277!2d-79.828052!3d43.71078!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b1407a332ea77%3A0x2c6bf2883e944c9a!2s33%20Sir%20Jacobs%20Crescent%2C%20Brampton%2C%20ON%20L7A%203V2%2C%20Canada!5e1!3m2!1sen!2sin!4v1736830459334!5m2!1sen!2sin"
          width="100%"
          height={450}
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </section>
</>

    </>
  );
};

export default Aboutus;
