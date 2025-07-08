import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
     <>
  <footer className="top_footer">
    <div className="container">
      <div className="row">
        <div className="col-md-3 col-sm-12 col-xs-12">
          <h2 className="footer_heading">Address</h2>
          <ul className="footerlist">
            <p>33 Sir Jacobs Crescent, Brampton, ON L7A 3V2</p>
            <li>
              <a href="tel:+16472415999"> Phone: +16472415999</a>
            </li>
            <li>
              <a href="mailto:Isoviafreightmanagement@gmail.com">
                Isoviafreightmanagement@gmail.com
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-sm-12 col-xs-12">
          <h2 className="footer_heading">Links</h2>
          <ul className="footerlist">
            <li>
              <a href="index.html">Home</a>
            </li>
            <li>
              <a href="about.html">About</a>
            </li>
            <li>
              <a href="login.html">Login</a>
            </li>
            <li>
              <a href="register.html">Register</a>
            </li>
            <li>
              <a href="contact.html">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-sm-12 col-xs-12">
          <h2 className="footer_heading">Software</h2>
          <ul className="footerlist">
            <li>
              <a href="Freight Management.html">
                Isovia Freight Management System{" "}
              </a>
            </li>
            <li>
              <a href="Fleet Management.html">
                Isovia Fleet Management System{" "}
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-sm-12 col-xs-12">
          <h2 className="footer_heading">Follow Us</h2>
          <ul className="footerlist" style={{ float: "left" }}>
            <a href="#" className="footerlink">
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a href="#" className="footerlink">
              <i className="fa-brands fa-linkedin-in" />
            </a>
            <a href="#" className="footerlink">
              <i className="fa-brands fa-x-twitter" />
            </a>
            <a href="#" className="footerlink">
              <i className="fa-brands fa-instagram" />
            </a>
          </ul>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4558.805351256277!2d-79.828052!3d43.71078!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b1407a332ea77%3A0x2c6bf2883e944c9a!2s33%20Sir%20Jacobs%20Crescent%2C%20Brampton%2C%20ON%20L7A%203V2%2C%20Canada!5e1!3m2!1sen!2sin!4v1736830459334!5m2!1sen!2sin"
            width="100%"
            height="100px"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  </footer>
  <footer className="footer_bottom">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-sm-12 text-center">
          <ul className="footer_bottom_list">
            <li>
              <a href="index.html">Home</a>
            </li>
            <li>
              <a href="news.html">News</a>
            </li>
            <li>
              <a href="blog.html">Blog</a>
            </li>
            <li>
              <a href="contact.html">Contact</a>
            </li>
          </ul>
        </div>
        <div className="col-lg-6 col-sm-12 text-center">
          <p className="text-center" style={{ color: "#fff" }}>
            Copyright © 2025 ISOVIA Technology Solutions Inc. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</>

    </>
  );
};

export default Footer;
