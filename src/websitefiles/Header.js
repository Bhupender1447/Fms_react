import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import 'bootstrap/dist/css/bootstrap.css';
const Header = () => {
  const [currentPageUrl, setCurrentPageUrl] = useState("");
  let location = useLocation();
  useEffect(() => {
    setCurrentPageUrl(location.pathname);
  }, [location]);

  const carouselItems = [
    {
      title: "ISOVIA INC. cloud based Freight Management System",
      buttonText1: "Read More",
      buttonText2: "Get A Quote",
      imgSrc: "images/firstimage.gif",
    },
    {
      title: "Unbeatable trucking & Transport Services",
      buttonText1: "Read More",
      buttonText2: "Get A Quote",
      imgSrc: "images/truck.png",
    },
    {
      title: "Unbeatable trucking & Transport Services",
      buttonText1: "Read More",
      buttonText2: "Get A Quote",
      imgSrc: "images/truck.png",
    },
    {
      title: "Unbeatable trucking & Transport Services",
      buttonText1: "Read More",
      buttonText2: "Get A Quote",
      imgSrc: "images/truck.png",
    },
  ];

  return (<>
  <header className="position-relative">
    <div className="top_header">
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col header-quick-link">
            <ul>
              <li>
                <a href="mailto:Isoviafreightmanagement@gmail.com" target="_top">
                  <i className="fas fa-envelope" aria-hidden="true" />
                  Isoviafreightmanagement@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+16472415999" target="_top">
                  <i className="fa-solid fa-phone" aria-hidden="true" />
                  +16472415999
                </a>
              </li>
            </ul>
            {/* </div>
    <div class="col-md-7 header-quick-link"> */}
            <ul>
              <li>
                <a href="contact.html" className="border-r">
                  Contact
                </a>
              </li>
              <li>
                <Link to={'/login'} className="border-r">
                  Login
                </Link>
              </li>
              <li>
                <Link to={'/registration'} className="border-r">
                  Register
                </Link>
              </li>
              <li>
                <Link to={'/logindriver'} className="border-r">
                  Login Drivers
                </Link>
              </li>
              <li>
                <Link to={'/loginagent'} className="border-r">
                  Login Agent
                </Link>
              </li>
              {/* <li class="dropdown"> <a href="#" class="dropdown-toggle" id="dropdownMenu1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Sofware <span class="caret"></span> </a>
          <ul class="dropdown-menu p-0" aria-labelledby="dropdownMenu1">
            <li><a class="dropdown-item" href="#" target="_blank">A</a></li>
            <li><a class="dropdown-item" href="#" target="_blank">B</a></li>
            <li><a class="dropdown-item" href="#" target="_blank">C</a></li>
          </ul>
        </li> */}
              <li>
                <ul className="flag-icon">
                  <li>
                    <a target="_blank" href="#">
                      <i className="fab fa-facebook-f" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="#">
                      <i className="fa-brands fa-x-twitter" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="#">
                      <i className="fab fa-linkedin-in" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="#">
                      <i className="fab fa-instagram" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>

  <header>
  <div className="bottom-header">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to={'/'}>
          <img src="../img/logo2.png" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to={'/'}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to={'/aboutus'}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to={"/partner"}>
                Partners
              </Link>
            </li>
            <li className="nav-item">
              <div className="dropdown">
                <button className="dropbtn">Sortware</button>
                <div className="dropdown-content">
                  <Link to={'/freightmanagement'} className="drop_menu">
                    Isovia Freight Management System{" "}
                  </Link>
                  <Link to={'/fleetmanagement'} className="drop_menu">
                    Isovia Fleet Management System{" "}
                  </Link>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to={'/news'}>
                News
              </Link>
            </li>
            <li className="nav-item">
            <div className="dropdown">
                <button className="dropbtn">Blog</button>
                <div className="dropdown-content">
                  <Link to={'/Article1'} className="drop_menu">
                  Article 1 - Isovia
                  </Link>
                  <Link to={'/Article2'} className="drop_menu">
                  Article 2 - Isovia
                  </Link>
                  <Link to={'/Article3'} className="drop_menu">
                  Article 3 - Isovia
                  </Link>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to={'/contact'}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

</header>


 
    {/* <div className={currentPageUrl === "/" ? "hero_area" : ""}>
      <section className="header_section">
        <div className="container">
          <nav className="navbar navbar-expand-lg custom_nav-container d-lg-none" >
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
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <a className="nav-link" href="index.html">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="about.html">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="service.html">
                    Service
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="shop.html">
                    Shop
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="company.html">
                    Company
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="contact.html">
                    Contact us
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="header_container">
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
                    <span>+16472415999</span>
                  </a>
                  <a href="" className="ml-4">
                    <div>
                      <img src="images/mail.png" alt="" />
                    </div>
                    <span>Isoviafreightmanagement@gmail.com</span>
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
                      <ul className="navbar-nav">
                        <li className="nav-item active">
                          <Link className="nav-link" to={"/"}>
                            Home <span className="sr-only">(current)</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to={"/aboutus"}>
                            About
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to={"/contact"}>
                            Contact us
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to={"/registration"}>
                            Registration
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to={"/login"}>
                            Login
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to={"/logindriver"}>
                            Login Driver
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to={"/loginagent"}>
                            Login Agent
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
      {currentPageUrl === "/" && (
        <section className="slider_section">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">
              {carouselItems.map((_, index) => (
                <li
                  key={index}
                  data-target="#carouselExampleIndicators"
                  data-slide-to={index}
                  className={index === 0 ? "active" : ""}
                />
              ))}
            </ol>
            <div className="carousel-inner">
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
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
                              <h1>{item.title}</h1>
                              <div className="d-flex">
                                <div>
                                  <a href="" className="read-btn">
                                    <span>{item.buttonText1}</span>
                                    <img src="images/white-next.png" alt="" />
                                  </a>
                                </div>
                                <div className="ml-3">
                                  <a href="" className="quote-btn">
                                    <span>{item.buttonText2}</span>
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
                              src={item.imgSrc}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div> */}
    </>
  );
};

export default Header;
