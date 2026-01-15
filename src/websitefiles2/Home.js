import { Link } from 'react-router-dom';

const Home = () => {
  return (
<>
  <section className="slider_section">
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-sm-12 slider_content">
          <h2>ISOVIA INC. cloud based Freight Management System</h2>
          <Link to="about.html">READ MORE</Link>
          <Link to="contact.html">GET A QUOTE</Link>
        </div>
        <div className="col-md-6 col-sm-12 slider_image">
          <img src="img/firstimage.gif" />
        </div>
      </div>
    </div>
  </section>
  <section className="banner_with_form">
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h4 className="cta-contact__title">
            Get In Touch <i className="fas fa-arrow-right" aria-hidden="true" />
          </h4>
          <p className="cta-contact__text">
            {" "}
            ISOVIA INC. cloud based Freight Management System
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 buttons">
          <Link to="tel:+16472415999" className="call_us_button">
            <i className="fa-solid fa-phone" />
            Call Us
          </Link>
          <Link to="contact.html" className="call_us_button">
            <i className="fas fa-arrow-right" aria-hidden="true" />
            Request a Quote
          </Link>
        </div>
      </div>
    </div>
  </section>
  <section className="counter-section">
    <div className="container">
      <div className="row">
        <div className="col-md-4 text-center drop-left">
          <div className="content-wrap drop-in">
            <h4>7000 +</h4>
            <p>Students Graduated</p>
          </div>
        </div>
        <div className="col-md-4 text-center drop-in">
          <div className="content-wrap drop-in">
            <h4>15,000 +</h4>
            <p>Customers</p>
          </div>
        </div>
        <div className="col-md-4 text-center drop-right">
          <div className="content-wrap drop-in">
            <h4>20 +</h4>
            <p>Years of experience</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section className="industry">
    <div className="container">
      <div className="row">
        <div className=" col-md-6 industry_content drop-left">
          <h1>About ISOVIA INC</h1>
          <p>
            Under Arshdeep's leadership, Isovia Inc. aims to revolutionize the
            logistics industry with advanced, accessible technology. Beyond TMS,
            Isovia is developing an AI Safety Assist tool for real-time guidance
            on compliance and safety practices to promote secure operations
            across partner companies. Future plans also include launching an
            integrated Load Board platform, which will foster a robust local
            network of trusted logistics partners and facilitate secure,
            economical transactions.
          </p>
          <p>
            With a unique blend of industry experience and technical expertise,
            Arshdeep leads Isovia’s mission to support a seamless, profitable
            workflow for the logistics sector, empowering companies with
            cutting-edge, tailored solutions to meet today’s challenges and
            tomorrow’s opportunities.
          </p>
          <Link to="about.html">Know More about Us</Link>
        </div>
        <div className=" col-md-6 industry_image">
          <img src="img/2truck.gif" />
        </div>
      </div>
    </div>
  </section>
  <section className="services-section">
    <div className="container">
      <h2 className="heading-inner drop-in">Our Services</h2>
      <div className="row our-services">
        <div className="col-md-4 md-mb-50">
          <div className="service-wrap education">
            <div className="img-part">
              <img src="img/fleet.png" style={{ display: "block" }} />
            </div>
            <div className="content-part text-center">
              <p>
                Our system enables brokers and shippers to manage thier fleets
                and loads.
              </p>
              <h5 className="title white-color">
                <Link to="#">SEE MORE</Link>
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 md-mb-50">
          <div className="service-wrap education">
            <div className="img-part">
              <img
                src="img/transportmanagement.png"
                style={{ display: "block" }}
              />
            </div>
            <div className="content-part text-center">
              <p>
                our system helps carriers to save money and time by managing
                thier all tasks at one platform
              </p>
              <h5 className="title white-color">
                <Link to="#"> SEE MORE</Link>
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 md-mb-30">
          <div className="service-wrap education">
            <div className="img-part">
              <img src="img/fuel-monitoring.png" style={{ display: "block" }} />
            </div>
            <div className="content-part text-center">
              <p>
                Effectively manage your fuel through our real time fuel tracker
              </p>
              <h5 className="title white-color">
                <Link to="#">SEE MORE</Link>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section className="isovia_partners">
    <div className="container">
      <div className="row">
        <div className="col-md-12 cl-xs-12 partners">
          <h2 className="drop-in">Partners</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 col-xs-12 partners_logo">
          <h2>Our Partners</h2>
          <div className="container">
            <div className="slider">
              <div className="slide-track">
                <div className="slide">
                  {" "}
                  <img
                    className="lazy"
                    src="img/samsara.png"
                    style={{ display: "block" }}
                  />{" "}
                </div>
                <div className="slide">
                  {" "}
                  <img
                    className="lazy"
                    src="img/KeepTrucking.png"
                    style={{ display: "block" }}
                  />{" "}
                </div>
                <div className="slide">
                  {" "}
                  <img
                    className="lazy"
                    src="img/samsara.png"
                    style={{ display: "block" }}
                  />{" "}
                </div>
                <div className="slide">
                  {" "}
                  <img
                    className="lazy"
                    src="img/KeepTrucking.png"
                    style={{ display: "block" }}
                  />{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section className="contact-section">
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <h2 className="contact_tittle drop-left">Get In Touch</h2>
        <p className="contact_text drop-left">
          Complete the form below Or Call Us 24/7
          <br />
          <Link to="tel:+91 9876543210">+91 9876543210</Link>
        </p>
      </div>
      <div className="row">
        <div className="col-md-6 col-xs-12">
          <form className="text-left contact_form">
            <div className="row">
              <div className="col-md-12 form-group">
                <label htmlFor="Name">Name</label>
                <input
                  type="text"
                  name="Name"
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="col-lg-6 form-group">
                <label htmlFor="phone">Phone</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <select className="form-control">
                      <option value={+1} selected="">
                        +1
                      </option>
                      <option value={+91}>+91</option>
                      <option value={+33}>+33</option>
                      <option value={+47}>+47</option>
                      <option value={+48}>+48</option>
                      <option value={+48}>+49</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    name="phone"
                    placeholder="Phone"
                  />
                </div>
              </div>
              <div className="col-lg-6 form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="Email"
                  placeholder="Email"
                />
              </div>
              <div className="col-md-12 form-group">
                <label htmlFor="Companyname">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Name"
                />
              </div>
              <div className="col-md-12 form-group">
                <label htmlFor="Message">Message</label>
                <textarea
                  className="form-control"
                  placeholder="Your Message"
                  defaultValue={""}
                />
              </div>
              <div className="col-md-12 form-group">
                <input
                  type="submit"
                  defaultValue="submit"
                  name="Submit"
                  className="btn"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-6 col-xs-12">
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
      </div>
    </div>
  </section>
</>

  );
};

export default Home;
