/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [activeService, setActiveService] = useState("list-1");
  const [modalOpen, setModalOpen] = useState(false);
  const [countersAnimated, setCountersAnimated] = useState(false);
  useEffect(() => {
    // FORCE RE-INITIALIZE BOOTSTRAP CAROUSEL ON ROUTE NAVIGATION
    const el = document.getElementById("carouselExampleFade");

    if (el && window.bootstrap) {
      try {
        // destroy old instance if exists
        const old = window.bootstrap.Carousel.getInstance(el);
        if (old) old.dispose();

        // create new carousel instance
        window.bootstrap.Carousel.getOrCreateInstance(el, {
          // interval: 3000,
          ride: "carousel",
          pause: false,
          wrap: true,
        });

        console.log("Carousel Reinitialized Successfully");
      } catch (err) {
        console.error("Carousel init error:", err);
      }
    }
  }, []);

  // Counter animation function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const animateCounters = () => {
    if (countersAnimated) return;

    const counters = document.querySelectorAll(".counter");
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-count");
        const prefix = counter.getAttribute("data-prefix") || "";
        const count = +counter.innerText.replace("+", "").replace(prefix, "");

        if (count < target) {
          const increment = target / 200;
          counter.innerText = Math.ceil(count + increment) + prefix;
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target + prefix;
        }
      };
      updateCount();
    });

    setCountersAnimated(true);
  };

  // Service click handler
  const handleServiceClick = (target) => {
    setActiveService(target);
  };

  // Modal handlers
  const openModal = () => setModalOpen(true);

  useEffect(() => {
    // Initialize service click handlers
    const listItems = document.querySelectorAll(".number-list-services-text");
    listItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const target = e.currentTarget.getAttribute("data-target");
        handleServiceClick(target);
      });
    });

    // Initialize modal handlers
    const circleBtn = document.getElementById("circleBtn");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("contactModal");

    if (circleBtn) {
      circleBtn.addEventListener("click", openModal);
    }

    if (closeModal) {
      closeModal.addEventListener("click", closeModal);
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    const counterSection = document.querySelector(".counter-section");
    if (counterSection) {
      observer.observe(counterSection);
    }

    // Initialize carousel
    const initializeCarousel = () => {
      const carousel = document.getElementById("carouselExampleFade");
      if (carousel) {
        const firstSlide = carousel.querySelector(".carousel-item");
        if (firstSlide && !firstSlide.classList.contains("active")) {
          firstSlide.classList.add("active");
        }
      }
    };

    initializeCarousel();

    // Cleanup
    return () => {
      listItems.forEach((item) => {
        item.removeEventListener("click", () => {});
      });

      if (circleBtn) {
        circleBtn.removeEventListener("click", openModal);
      }

      if (closeModal) {
        closeModal.removeEventListener("click", closeModal);
      }

      if (modal) {
        modal.removeEventListener("click", () => {});
      }

      if (counterSection) {
        observer.unobserve(counterSection);
      }
    };
  }, [animateCounters, countersAnimated]);

  return (
    <>
      <section className="banner-section">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="banner-section-bg" data-aos="zoom-out">
                <div className="banner-textarea-section">
                  <div className="banner-textarea-section-heading">
                    <h2>ISOVIA INC. cloud based Freight Management System</h2>
                  </div>
                  <div className="banner-textarea-section-subheading">
                    <p>
                      "Bring transparency and efficiency to logistics with
                      Isovia's cloud freight system."
                    </p>
                  </div>
                  <div className="banner-textarea-section-buttons">
                    <Link to="/aboutus">
                      Read More
                      <img
                        src="images/truck-tire-icon-removebg-preview.png"
                        className="tire-icon"
                        alt="Tire"
                      />
                    </Link>
                    <Link to="/contact">
                      Get A Quote
                      <img
                        src="images/truck-tire-icon-removebg-preview.png"
                        className="tire-icon"
                        alt="Tire"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <div className="banner-section-bg" data-aos="zoom-out">
                <div className="main-container">
                  <div className="content">
                  
                    <div className="cube-section">
                      <div className="rings">
                        <div className="scene">
                          <div className="cube">
                            <div className="cube-face front">
                              <img src="images/logo.png" alt="Isovia Logo" />
                            </div>
                            <div className="cube-face back">
                              <img src="images/logo.png" alt="Isovia Logo" />
                            </div>
                            <div className="cube-face right">
                              <img src="images/logo.png" alt="Isovia Logo" />
                            </div>
                            <div className="cube-face left">
                              <img src="images/logo.png" alt="Isovia Logo" />
                            </div>
                            <div className="cube-face top">
                              <img src="images/logo.png" alt="Isovia Logo" />
                            </div>
                            <div className="cube-face bottom">
                              <img src="images/logo.png" alt="Isovia Logo" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      <div className="text-section mt-5">
                      <h1>
                        The Future of <br></br>
                         <span className="animated-gradient">
                          Intelligent Logistics
                        </span>
                      </h1>
                      <p>
                        Experience next-generation fleet management powered by
                        quantum computing, neural networks, and <br></br>autonomous AI
                        systems that revolutionize transportation logistics.
                      </p>
                      <div className="buttons">
                        <Link to="#" className="btn-primary">
                          Start Neural Demo
                        </Link>
                        <Link to="#" className="btn-secondary">
                          Explore Technology →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      <section className="about-section">
        <div className="about-us-section-text-area">
          <div className="about-us-section-text-area-title">
            <h2>About ISOVIA INC</h2>
          </div>
          <div className="about-us-section-text-area-subtitle">
            <p>
              Under Arshdeep's leadership, Isovia Inc. aims to revolutionize the
              logistics industry with advanced, accessible technology. Beyond
              TMS, Isovia is developing an AI Safety Assist tool for real-time
              guidance on compliance and safety practices to promote secure
              operations across partner companies. Future plans also include
              launching an integrated Load Board platform, which will foster a
              robust local network of trusted logistics partners and facilitate
              secure, economical transactions. With a unique blend of industry
              experience and technical expertise, Arshdeep leads Isovia's
              mission to support a seamless, profitable workflow for the
              logistics sector, empowering companies with cutting-edge, tailored
              solutions to meet today's challenges and tomorrow's opportunities.
            </p>
          </div>
        </div>
        {/* <div className="truck-png">
          <img src="images/truck-png.png" alt="Animated truck driving" />
        </div>
        <div className="bushes-png">
          <img src="images/bushes-img.png" alt="Bushes foreground" />
        </div>
        <div className="road-png-section">
          <img src="images/road-png.png" alt="Road background" />
        </div> */}
      </section>

      <section className="services-section">
       <div className="section-container">
         <div className="services-section-textarea">
          <div className="services-container">
            <div>
              <div className="services-section-title">
                <h2>Our Services</h2>
              </div>
              <ol className="number-list-services">
                <li
                  className={`number-list-services-text ${
                    activeService === "list-1" ? "active" : ""
                  }`}
                  data-target="list-1"
                >
                  Brokers and Shippers
                </li>
                <li
                  className={`number-list-services-text ${
                    activeService === "list-2" ? "active" : ""
                  }`}
                  data-target="list-2"
                >
                  Save Money
                </li>
                <li
                  className={`number-list-services-text ${
                    activeService === "list-3" ? "active" : ""
                  }`}
                  data-target="list-3"
                >
                  Fuel Tracker
                </li>
              </ol>
            </div>
            <div>
              <div
                className={`services-section-service-list-content ${
                  activeService === "list-1" ? "active" : ""
                }`}
                id="list-1"
              >
                <p>
                  Our system enables brokers and shippers to manage their fleets
                  and loads.
                </p>
                <div className="service-img">
                  <img src="images/servie-1.png" alt="" />
                </div>
                <div className="banner-textarea-section-buttons">
                  <Link to="#">
                    See More
                    <img
                      src="images/truck-tire-icon-removebg-preview.png"
                      className="tire-icon"
                      alt="Tire"
                    />
                  </Link>
                </div>
              </div>
              <div
                className={`services-section-service-list-content ${
                  activeService === "list-2" ? "active" : ""
                }`}
                id="list-2"
              >
                <p>
                  Our system helps carriers save money and time by managing all
                  tasks on one platform.
                </p>
                <div className="service-img">
                  <img src="images/servie-2.png" alt="" />
                </div>
                <div className="banner-textarea-section-buttons">
                  <Link to="#">
                    See More
                    <img
                      src="images/truck-tire-icon-removebg-preview.png"
                      className="tire-icon"
                      alt="Tire"
                    />
                  </Link>
                </div>
              </div>
              <div
                className={`services-section-service-list-content ${
                  activeService === "list-3" ? "active" : ""
                }`}
                id="list-3"
              >
                <p>
                  Effectively manage your fuel through our real-time fuel
                  tracker.
                </p>
                <div className="service-img">
                  <img src="images/servie-3.png" alt="" />
                </div>
                <div className="banner-textarea-section-buttons">
                  <Link to="#">
                    See More
                    <img
                      src="images/truck-tire-icon-removebg-preview.png"
                      className="tire-icon"
                      alt="Tire"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
       </div>
      </section>

      <section className="counter-section section-container">
        <div className="container ">
          <div className="row">
            <div className="col-md-4 text-center drop-left">
              <div className="content-wrap">
                <h4 className="counter" data-count={7000}>
                  0
                </h4>
                <p>Students Graduated</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="content-wrap">
                <h4 className="counter" data-count={15000}>
                  0
                </h4>
                <p>Customers</p>
              </div>
            </div>
            <div className="col-md-4 text-center drop-right">
              <div className="content-wrap">
                <h4 className="counter" data-count={20} data-prefix="+">
                  0
                </h4>
                <p>Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-sections">
        <div className="blog-section-bg">
          <video autoPlay muted loop playsInline id="bg-video">
            <source src="images/blog-bg.mp4" type="video/mp4" />
          </video>
          <div className="container blog-text">
            <div className="blog-section-textarea">
              <div className="title-blog">
                <h2>Blogs</h2>
                <p className="blog-subtitle">
                  Stay informed with our latest thoughts, trends, and tech
                  stories.
                </p>
              </div>
              <div className="row blogs-section">
                <div className="col-md-4 blog-sec-responsive">
                  <div className="blog-1-img">
                    <img src="images/blog-1.png" alt="" />
                  </div>
                  <div className="blog-article">
                    <h4 className="blog-article-title">Real-time Monitoring</h4>
                    <p className="blog-article-excerpt">
                      The current logistics scenario increasingly demands
                      accurate and fast deliveries. With efficient
                      transportation........
                    </p>
                    <Link to="#" className="read-more">
                      Read More →
                    </Link>
                  </div>
                </div>
                <div className="col-md-4 blog-sec-responsive">
                  <div className="blog-1-img">
                    <img src="images/blog-2.png" alt="" />
                  </div>
                  <div className="blog-article">
                    <h4 className="blog-article-title">The Meaning of IFM</h4>
                    <p className="blog-article-excerpt">
                      Logistics is a fundamental sector of the global economy,
                      connecting companies, suppliers and consumers
                      through........
                    </p>
                    <Link to="#" className="read-more">
                      Read More →
                    </Link>
                  </div>
                </div>
                <div className="col-md-4 blog-sec-responsive">
                  <div className="blog-1-img">
                    <img src="images/blog-3.png" alt="" />
                  </div>
                  <div className="blog-article">
                    <h4 className="blog-article-title">
                      Sustainability in transportation
                    </h4>
                    <p className="blog-article-excerpt">
                      Freight transportation is an essential part of the global
                      economy, where various goods ........
                    </p>
                    <Link to="#" className="read-more">
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
              <div className="view-all-btn flex justify-content-center mx-auto">
                <Link to="#">View All Articles</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="partners-section-home">
        <div className="container">
          <div className="partner-section-logos">
            <div className="partner-section-logos-list">
              <ul className="list-of-logos">
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/samsara.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/KeepTrucking.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/trimbleconnect.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/waterconect.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/samsara.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/KeepTrucking.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/trimbleconnect.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/waterconect.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/samsara.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/KeepTrucking.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/trimbleconnect.png" alt="" />
                  </Link>
                </li>
                <li className="partner-logos">
                  <Link to="#">
                    <img src="images/waterconect.png" alt="" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="custom-cursor" />
      </section>

      <section className="network-section">
        <div className="bg-grid" />
        <div className="network-section-text-area">
          <div className="network-section-text-area-title">
            <h2>IFM Smart Logistics Network</h2>
          </div>
          <div className="network-section-text-area-subtitle">
            <p>
              Next-Generation Autonomous Dispatch System that optimizes
              logistics operations with smart automation and real-time
              coordination.
            </p>
          </div>
        </div>
        <div className="timeline">
          <div className="step">
            <div className="icon-container">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 10h10M7 14h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                  stroke="#00c853"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
              <div
                className="rotating-arc"
                style={{
                  borderColor: "#00c853 transparent transparent transparent",
                }}
              />
            </div>
            <div className="label">
              01
              <br />
              Load Booked
            </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx={12}
                  cy={12}
                  r={6}
                  stroke="#00bfa5"
                  strokeWidth={2}
                />
              </svg>
              <div
                className="rotating-arc"
                style={{
                  borderColor: "#00bfa5 transparent transparent transparent",
                }}
              />
            </div>
            <div className="label">
              02
              <br />
              Load entered in IFM
            </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M2 12h20" stroke="#00acc1" strokeWidth={2} />
              </svg>
              <div
                className="rotating-arc"
                style={{
                  borderColor: "#00acc1 transparent transparent transparent",
                }}
              />
            </div>
            <div className="label">
              03
              <br />
              Dispatcher assigns load
            </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3h18v6H3V3zm0 12h18v6H3v-6z"
                  stroke="#ff9800"
                  strokeWidth={2}
                />
              </svg>
              <div
                className="rotating-arc"
                style={{
                  borderColor: "#ff9800 transparent transparent transparent",
                }}
              />
            </div>
            <div className="label">
              04
              <br />
              Driver accepts & picks up
            </div>
          </div>
          <div className="step">
            <div className="icon-container">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l4 8H8l4-8zm0 20v-6"
                  stroke="#3f51b5"
                  strokeWidth={2}
                />
              </svg>
              <div
                className="rotating-arc"
                style={{
                  borderColor: "#3f51b5 transparent transparent transparent",
                }}
              />
            </div>
            <div className="label">
              05
              <br />
              Driver reaches pickup
            </div>
          </div>
          <div className="moving-square" />
        </div>
      </section>

      <section className="software-sections">
        <div className="software-section-bg">
          <video autoPlay muted loop playsInline id="bg-video">
            <source src="images/softwares-1.mp4" type="video/mp4" />
          </video>
          <div className="container softwares-text">
            <div className="software-sectiontexrarrea">
              <div className="title-software">
                <h2>Softwares</h2>
              </div>
              <div className="software-section-description-softwares">
                <div className="row softwares-section">
                  <div className="col-md-6" data-aos="fade-right">
                    <div className="software-1-description">
                      <h4 className="software-1-description-title">
                        Isovia Freight Management System
                      </h4>
                      <p className="software-1-description-subtitle">
                        Freight brokers, logistics companies, and
                        small-to-medium businesses handling freight.
                      </p>
                      <div className="keypoints-software-1">
                        <ul className="list-softwares-1">
                          <li className="list-item">Efficiency Boost</li>
                          <li className="list-item">Cost Reduction</li>
                          <li className="list-item">Real-Time Visibility</li>
                          <li className="list-item">Regulatory Compliance</li>
                          <li className="list-item">User-Friendly Interface</li>
                          <li className="list-item">Scalability</li>
                          <li className="list-item">
                            Integration with Industry Leaders
                          </li>
                          <li className="list-item">
                            Subscription Flexibility
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6" data-aos="fade-left">
                    <div className="software-1-description">
                      <h4 className="software-1-description-title">
                        Isovia Freight Management System
                      </h4>
                      <p className="software-1-description-subtitle">
                        Freight brokers, logistics companies, and
                        small-to-medium businesses handling freight.
                      </p>
                      <div className="keypoints-software-1">
                        <ul className="list-softwares-1">
                          <li className="list-item">Efficiency Boost</li>
                          <li className="list-item">Cost Reduction</li>
                          <li className="list-item">Real-Time Visibility</li>
                          <li className="list-item">Regulatory Compliance</li>
                          <li className="list-item">User-Friendly Interface</li>
                          <li className="list-item">Scalability</li>
                          <li className="list-item">
                            Integration with Industry Leaders
                          </li>
                          <li className="list-item">
                            Subscription Flexibility
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="view-all-btn flex justify-content-center mx-auto mt-5" data-aos="zoom-in">
                  <Link to="#">View All</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="get-in-touch-section">
        <section className="get-in-touch">
          <div className="get-in-touch-left">
            <h2>
              <span>Get in Touch</span>
            </h2>
            <p>
              We'd love to hear from you. Fill out the form to start a
              conversation.
            </p>
          </div>
          <div className="circle-container">
            <div className="outer-border" />
            <div className="rays">
              {[...Array(24)].map((_, index) => (
                <div key={index} className="ray" />
              ))}
            </div>
            <div className="circle-border" />
            <button id="circleBtn" className="circle-btn">
              Click Here
            </button>
          </div>
        </section>
        <section
          className="maps-link"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4558.806568275673!2d-79.828052!3d43.710764!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b1407a332ea77%3A0x2c6bf2883e944c9a!2s33%20Sir%20Jacobs%20Crescent%2C%20Brampton%2C%20ON%20L7A%203V2%2C%20Canada!5e1!3m2!1sen!2sin!4v1760336164605!5m2!1sen!2sin"
            width="100%"
            height={450}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

        <div id="contactModal" className={`modal ${modalOpen ? "active" : ""}`}>
          <div className="modal-content">
            <button id="closeModal" className="close-btn">
              ×
            </button>
            <h3>Get in Touch</h3>
            <form>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone" required />
              <input type="text" placeholder="Company Name" />
              <textarea rows={4} placeholder="Your Message" defaultValue={""} />
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
