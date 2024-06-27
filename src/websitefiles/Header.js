import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [currentPageUrl, setCurrentPageUrl] = useState("");
  let location = useLocation();
  useEffect(() => {
    setCurrentPageUrl(location.pathname);
  }, [location]);
  return (
    <div className={currentPageUrl == "/" ? "hero_area" : ""}>
      <section className="header_section">
        <div className="container">
          <nav className="navbar navbar-expand-lg custom_nav-container d-lg-none">
            <a className="navbar-brand" href="#">
              <div className="logo-box">
                <img src="images/logo.png" alt="" />
                <span>ISOVIA INC</span>
              </div>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav  ">
                <li className="nav-item active">
                  <a className="nav-link" href="index.html">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="about.html">
                    {" "}
                    About{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="service.html">
                    {" "}
                    Service
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="shop.html">
                    {" "}
                    Shop{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="company.html">
                    {" "}
                    Company{" "}
                  </a>
                </li>
                <li className="nav-item ">
                  <a className="nav-link " href="contact.html">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="header_container ">
            <div className="logo-box">
              <img src="images/logo2.png" alt="" />
              <span>ISOVIA INC</span>
            </div>
            <div>
              <div className="header_top">
                <div className="header_top-contact">
                  <a href="" className="ml-4">
                    <div>
                      <img src="images/phone.png" alt="" />
                    </div>
                    <span>(+71)258964785</span>
                  </a>
                  <a href="" className="ml-4">
                    <div>
                      <img src="images/mail.png" alt="" />
                    </div>
                    <span>transportz@gmail.com</span>
                  </a>
                </div>
                <div className="header_top-social">
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
              <div className="header_btm">
                <nav className="navbar navbar-expand-lg custom_nav-container pt-3">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon" />
                  </button>
                  <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <div className="d-flex mx-auto flex-column flex-lg-row align-items-center">
                      <ul className="navbar-nav  ">
                        <li className="nav-item active">
                          <Link className="nav-link" to={"/"}>
                            Home <span className="sr-only">(current)</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to={"/aboutus"}>
                            {" "}
                            About{" "}
                          </Link>
                        </li>
                        <li className="nav-item ">
                          <Link className="nav-link pr-0" to={"/contact"}>
                            Contact us
                          </Link>
                        </li>
                        <li className="nav-item ">
                          <Link className="nav-link pr-0" to={"/registration "}>
                          registration 
                          </Link>
                        </li>
                        <li className="nav-item ">
                          <Link className="nav-link pr-0" to={"/login"}>
                          Login 
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      {currentPageUrl == "/" ? (
          <section className=" slider_section ">
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-ride="carousel"
            >
              <ol className="carousel-indicators">
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to={0}
                  className="active"
                />
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to={1}
                />
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to={2}
                />
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to={3}
                />
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="container">
                    <div className="slider_item-container">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="slider_item-detail">
                            <div className="slider_form-box">
                              <form action="">
                                <div className="search_input">
                                  <input type="text" />
                                  <img src="images/search-icon.png" alt="" />
                                </div>
                                <button>Search</button>
                              </form>
                            </div>
                            <div>
                              <h1>
                                ISOVIA INC.
                                <br />
                                cloud based Freight Management System
                              </h1>
                              <div className="d-flex">
                                <div>
                                  <a href="" className="read-btn">
                                    <span>Read More</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                                <div className="ml-3">
                                  <a href="" className="quote-btn">
                                    <span>Get A Quote</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="slider_img-box">
                            <img
                              src="images/firstimage.gif"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="container">
                    <div className="slider_item-container">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="slider_item-detail">
                            <div className="slider_form-box">
                              <form action="">
                                <div className="search_input">
                                  <input type="text" />
                                  <img src="images/search-icon.png" alt="" />
                                </div>
                                <button>Search</button>
                              </form>
                            </div>
                            <div>
                              <h1>
                                Unbeatable <br />
                                trucking &amp; Transport <br />
                                Services
                              </h1>
                              <div className="d-flex">
                                <div>
                                  <a href="" className="read-btn">
                                    <span>Read More</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                                <div className="ml-3">
                                  <a href="" className="quote-btn">
                                    <span>Get A Quote</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="slider_img-box">
                            <img
                              src="images/truck.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="container">
                    <div className="slider_item-container">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="slider_item-detail">
                            <div className="slider_form-box">
                              <form action="">
                                <div className="search_input">
                                  <input type="text" />
                                  <img src="images/search-icon.png" alt="" />
                                </div>
                                <button>Search</button>
                              </form>
                            </div>
                            <div>
                              <h1>
                                Unbeatable <br />
                                trucking &amp; Transport <br />
                                Services
                              </h1>
                              <div className="d-flex">
                                <div>
                                  <a href="" className="read-btn">
                                    <span>Read More</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                                <div className="ml-3">
                                  <a href="" className="quote-btn">
                                    <span>Get A Quote</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="slider_img-box">
                            <img
                              src="images/truck.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="container">
                    <div className="slider_item-container">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="slider_item-detail">
                            <div className="slider_form-box">
                              <form action="">
                                <div className="search_input">
                                  <input type="text" />
                                  <img src="images/search-icon.png" alt="" />
                                </div>
                                <button>Search</button>
                              </form>
                            </div>
                            <div>
                              <h1>
                                Unbeatable <br />
                                trucking &amp; Transport <br />
                                Services
                              </h1>
                              <div className="d-flex">
                                <div>
                                  <a href="" className="read-btn">
                                    <span>Read More</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                                <div className="ml-3">
                                  <a href="" className="quote-btn">
                                    <span>Get A Quote</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="slider_img-box">
                            <img
                              src="images/truck.png"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          ""
        )}
    </div>
  );
};

export default Header;
