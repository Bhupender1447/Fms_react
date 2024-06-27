import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <section className="info_section ">
        <div className="container ">
          <div className="row  mb-3 pb-4">
            <div className="col-md-3 info_logo">
              <div className="logo-box">
                <img src="images/logo2.png" alt="" />
                <span>ISOVIA INC</span>
              </div>
              <p>
                
              </p>
              <div className="info_social">
                <div>
                  <a href="">
                    <img src="images/fb.png" alt="" />
                  </a>
                </div>
                <div>
                  <a href="">
                    <img src="images/twitter.png" alt="" />
                  </a>
                </div>
                <div>
                  <a href="">
                    <img src="images/g-plus.png" alt="" />
                  </a>
                </div>
                <div>
                  <a href="">
                    <img src="images/linkedin.png" alt="" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-3 info_address">
              <h5>Address</h5>
              <p>33 Sir Jacobs Crescent, Brampton, ON L7A 3V2</p>
              <p>Phone 4375337602</p>
              {/* <p>(+71) 8522369417</p> */}
              <p>
                {/* <a href="">transportz@gmail.com</a> */}
              </p>
            </div>
            <div className="col-md-3 info_links">
              <div className="info_nav ">
                <nav className="">
                  <ul>
                    <h5>Links</h5>
                    <li>
                      <Link to="/"> Home</Link>
                    </li>
                    <li>
                      <Link to="/aboutus">About</Link>
                    </li>
                    <li>
                      <Link to='/contact'>Contact us</Link>
                    </li>
                    <li>
                      <Link to='/registration '>registration </Link>
                    </li>
                    
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-md-3 info_news">
              <h5>Newsletter</h5>
              <form action="">
                <div>
                  <input type="text" placeholder="Your Name" />
                </div>
                <div>
                  <input type="email" placeholder="Email" />
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="container-fluid footer_section">
        <p>Copyright © 2024 All Rights Reserved By</p>
      </section>
    </>
  );
};

export default Footer;
